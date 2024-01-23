import { ChatMessage, isValidConnectMessage, isValidMessage, isValidSubscribeMessage } from '~/shared/types/shared/websocketMessage';
import { Env } from '../env';
import handleErrors from '../helpers/handleErrors';

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

function isServerSession(session: SessionType): session is ServerSession {
	return session.type === 'server';
}

export class Server implements DurableObject {
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

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;
	}

	async addMessage(message: ChatMessage) {
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

			// If not client websocket connection, then expect POST request
			if (request.method !== 'POST') {
				return new Response('Method not allowed', { status: 405 });
			}

			const requestData = await request.json();

			const webSocketPair = new WebSocketPair();
			const [client, server] = Object.values(webSocketPair);

			// Get the client's IP address for use with the rate limiter.
			let ip = request.headers.get('CF-Connecting-IP') || 'localhost';

      if (isValidConnectMessage(requestData)) {
        this.state.acceptWebSocket(server, [requestData.type, requestData.from, ip]);
        return new Response(null, { status: 101, webSocket: client });
      } else if (isValidSubscribeMessage(requestData)) {
        this.state.acceptWebSocket(server, [requestData.type, requestData.from, ip]);
        return new Response(null, { status: 101, webSocket: client });
      }

      return new Response('Invalid data format', { status: 400 });
		});
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
		console.log('[server] message', message);
	}

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[server] Connection closed with code ${code}`);
		ws.close();
	}

	webSocketError(ws: WebSocket, error: unknown) {
		console.log('[server] error', error);
	}
}
