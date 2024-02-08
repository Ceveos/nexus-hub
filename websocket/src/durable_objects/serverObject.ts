import { Action, ChatMessage, WebsocketMessage, isValidWebsocketMessage } from '~/shared/types/shared/websocketMessage';
import { Env } from '../env';
import handleErrors from '../helpers/handleErrors';
import { ConnectedMessage } from '~/shared/types/server/connectMessage';
import prisma from '../lib/prisma';

interface Session {
	type: string;
}

interface ServerMetadata {}

interface ServerSession extends Session {
	type: 'server';
	metadata: ServerMetadata;
}

interface UserSession extends Session {
	type: 'user';
}

type SessionType = ServerSession | UserSession;

enum WebsocketTag {
	owner = 'owner',
	server = 'server',
	subscriber = 'subscriber',
	// client = 'client',
}

function isServerSession(session: SessionType): session is ServerSession {
	return session.type === 'server';
}

export class ServerObject implements DurableObject {
	private messages: ChatMessage[] = [];
	// private metadata?: ServerMetadata;
	private lastTimeStamp: number = 0;
	private initialized: boolean = false;
	// private sessions: Map<WebSocket, Session> = new Map();
	readonly MAX_MESSAGES = 500;
	readonly TRIM_THRESHOLD = 750;
	state: DurableObjectState;
	storage: DurableObjectStorage;
	env: Env;
	server?: WebSocket;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;

		this.server = this.state.getWebSockets(WebsocketTag.owner)[0];
	}

	async addMessage(message: ChatMessage) {
		console.log(`[${message.from}] ${message.message}`);
		this.messages.push(message);
		if (this.messages.length > this.TRIM_THRESHOLD) {
			// Remove the oldest message(s) to maintain the cap
			this.messages.splice(0, this.messages.length - this.MAX_MESSAGES);
		}
		

		await this.saveMessages();
	}

	getMessages(page: number = 0, pageSize: number = 100): ChatMessage[] {
		const start = Math.max(this.messages.length - page * pageSize, 0);
		const end = Math.max(start - pageSize, 0);
		return this.messages.slice(end, start).reverse();
	}

	private async saveMessages() {
		await this.storage.put('messages', this.messages);
	}

	async initialize() {
		let storedMessages = (await this.state.storage.get('messages')) as ChatMessage[];
		this.messages = storedMessages || [];
		this.initialized = true;
	}

	async fetch(request: Request) {
		if (!this.initialized) {
			await this.initialize();
		}

		return await handleErrors(request, async () => {
			// Handle client websocket connection
			if (request.headers.get('Upgrade') !== 'websocket') {
				return new Response('Expected websocket', { status: 400 });
			}

			const searchParams = new URL(request.url).searchParams;

			const action = searchParams.get('action') ?? request.headers.get('action');
			switch (action as Action) {
				case 'connect':
					return this.connectHandler(request, searchParams);
				case 'subscribe':
					return new Response('Not implemented', { status: 501 });
				default:
					return new Response('Invalid action', { status: 404 });
			}
		});
	}

	async connectHandler(request: Request, searchParams: URLSearchParams): Promise<Response> {
		const serverId = searchParams.get('serverId') ?? request.headers.get('serverId');
		const communitySecret = searchParams.get('communitySecret') ?? request.headers.get('communitySecret');

		if (!serverId) {
			return new Response('Server ID not provided', { status: 404 });
		}

		const serverData = await prisma(this.env).server.findUnique({
			where: {
				id: serverId,
			},
			include: {
				community: true,
			},
		});

		if (!serverData) {
			return new Response('Server for server not found', { status: 404 });
		}

		if (!serverData.community) {
			return new Response('Community for server not found', { status: 404 });
		}

		if (serverData.community.secret !== communitySecret) {
			return new Response('Unauthorized: Community secret does not match', { status: 401 });
		}

		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		const serverConnectedMessage: ConnectedMessage = {
			from: {
				type: 'server',
				id: serverId,
				stubId: this.state.id.toString(),
			},
			payload: {
				action: 'connected',
			},
			version: '1.0.0',
		};

		// Close existing server since this is overtaking it.
		this.server?.close(1000, 'New server connected');

		this.state.acceptWebSocket(server, [WebsocketTag.owner, WebsocketTag.server, serverId]);
		this.server = server;

		console.log('[Server] Sending connected message');
		server.send(JSON.stringify(serverConnectedMessage));
		console.log('[Server] returning websocket client');
		return new Response(null, { status: 101, webSocket: client });
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
		console.log('[server] message', message);

		try {
			const parsedMessage = JSON.parse(message.toString());
			if (!isValidWebsocketMessage(parsedMessage)) {
				console.log('[server] invalid message', message);
				return;
			}

			if (this.server === ws) {
				this.handleServerMessage(parsedMessage);
			} else {
				this.handleNonServerMessage(ws, parsedMessage);
			}

		} catch (e) {
			console.log('[server] invalid message', message);
			return;
		}
	}

	handleServerMessage(message: WebsocketMessage) {
		this.lastTimeStamp = Date.now();
		const { payload } = message;
		if (!payload) {
			return;
		}

		switch (payload.action) {
			case 'message':
				this.addMessage(payload.data);
				break;
			default:
				console.log(`Unexpected message action: ${message.payload?.action}`);
				break;
		}
	}

	handleNonServerMessage(socket: WebSocket, message: WebsocketMessage) {
		const { payload } = message;
		if (!payload) {
			return;
		}

		switch (payload.action) {
			case 'messages/request':
				const messages = this.getMessages();
				const response: WebsocketMessage = {
					from: {
						type: 'server',
						id: 'server',
						stubId: this.state.id.toString(),
					},
					payload: {
						action: 'messages/response',
						data: messages,
					},
					version: '1.0.0',
				};
				socket.send(JSON.stringify(response));
				break;
			default:
				console.log(`Unexpected message action: ${message.payload?.action}`);
				break;
		}
	}

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[server] Connection closed with code ${code}`);
		ws.close();
	}

	webSocketError(ws: WebSocket, error: unknown) {
		console.log('[server] error', error);
	}
}
