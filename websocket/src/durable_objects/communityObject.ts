import { Env } from '../env';
import { Action, SubscribeMessage } from '~/shared/types/shared/websocketMessage';
import handleErrors from '../helpers/handleErrors';
import { ConnectedMessage } from '~/shared/types/server/connectMessage';
import { getClientType } from '~/shared/types/shared/clientType';
import prisma from '../lib/prisma';

interface IMetadata {
	id: string;
	limiterId: string;

}

interface ServerMetadata extends IMetadata {
	type: "Server"
}

interface UserMetadata extends IMetadata {
	type: "User"
}

type Metadata = UserMetadata | ServerMetadata;

export class CommunityObject implements DurableObject {
	state: DurableObjectState;
	storage: DurableObjectStorage;
	env: Env;
	communityId?: string;
	userSessions: Map<WebSocket, UserMetadata> = new Map();
	serverSessions: Map<string, WebSocket> = new Map();

	// Key: ServerId, Value: userId[]
	serverSubscriptions: Map<string, string[]> = new Map();

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;

		this.state.getWebSockets().forEach((webSocket) => {
			const meta: Metadata = webSocket.deserializeAttachment();
			// Set up limiter here
			// let limiterId = this.env.LIMITER.idFromString(meta.limiterId);
			// let limiter = new RateLimiterClient(
			//   () => this.env.limiters.get(limiterId),
			//   err => webSocket.close(1011, err.stack));
		});
	}

	async initialize(communityId: string) {
		if (!this.communityId) {
			const storedCommunityId = await this.state.storage.get('communityId');
			if (!storedCommunityId) {
				await this.state.storage.put('communityId', communityId);
				this.communityId = communityId;
			} else {
				this.communityId = storedCommunityId as string;
			}
		}
	}

	async fetch(request: Request) {
		return await handleErrors(request, async () => {
			// Handle client websocket connection
			if (request.headers.get('Upgrade') !== 'websocket') {
				return new Response('Expected websocket', { status: 400 });
			}

			const searchParams = new URL(request.url).searchParams;
			const communityId = searchParams.get('communityId') ?? searchParams.get('id');

			if (!communityId) {
				return new Response('Community ID not provided', { status: 404 });
			}

			if (this.env.COMMUNITY.idFromName(communityId).toString() !== this.state.id.toString()) {
				return new Response('Invalid Community ID for object', { status: 401 });
			}

			await this.initialize(communityId);

			if (this.communityId !== communityId) {
				return new Response('Community ID does not match expected', { status: 401 });
			}

			const action = searchParams.get('action');
			switch (action as Action) {
				case 'connect':
					return this.handleConnectRequest(request, searchParams);
				// case 'subscribe':
				// 	return this.subscribeHandler(request);
				default:
					return new Response('Invalid action', { status: 404 });
			}
		});
	}

	// async subscribeHandler(request: Request): Promise<Response> {
	// 	// Set up our rate limiter client.
	// 	let limiterId = this.env.LIMITER.idFromName(ip);
	// 	let limiter = new RateLimiterClient(
	// 		() => this.env.LIMITER.get(limiterId),
	// 		err => server.close(1011, err.stack));

	// 	// Create our session and add it to the sessions map.
	// 	let userMetadata: UserMetadata = { limiterId, limiter, blockedMessages: [] };
	// 	// attach limiterId to the webSocket so it survives hibernation
	// 	server.serializeAttachment({ ...server.deserializeAttachment(), limiterId: limiterId.toString() });
	// 	this.userSessions.set(server, userMetadata);
	// }

	handleConnectRequest(request: Request, searchParams: URLSearchParams): Promise<Response> {
		const webSocketPair = new WebSocketPair();
		const [clientWs, serverWs] = Object.values(webSocketPair);
		let tags: string[] = [];

		// Get client type
		const clientType = getClientType(request.headers);

		switch (clientType) {
			case "server":
				return this.handleServerConnectRequest(clientWs, serverWs, request);
			case "user":
				return this.handleUserConnectRequest(clientWs, serverWs, request);
			default:
				return Promise.resolve(new Response('Invalid client type', { status: 400 }));
		}
	}

	async handleServerConnectRequest(client: WebSocket, server: WebSocket, request: Request): Promise<Response> {
		// // Get the server's ID for use with the rate limiter.
		const serverId = request.headers.get("X-Server-ID");
		const communitySecret = request.headers.get("X-Community-Secret");

		if (!serverId || !communitySecret) {
			return new Response('Missing Server ID or Community Secret', { status: 400 });
		}

		const community = await prisma(this.env).community.findUnique({
			where: {
			  id: this.communityId,
			  secret: communitySecret,
			  servers: {
				some: {
					id: serverId
				}
			  }
			},
		  });
		
		if (!community) {
			return new Response('Invalid Server ID or Community Secret', { status: 400 });
		}

		// let userId = request.headers.get('X-User-ID');
		this.state.acceptWebSocket(server);
		const communityConnectedMessage: ConnectedMessage = {
			from: {
				type: 'community',
				id: community.id,
				stubId: this.state.id.toString(),
			},
			payload: {
				action: 'connected',
			},
			version: "1.0.0"
		};

		server.send(JSON.stringify(communityConnectedMessage));
		return new Response(null, { status: 101, webSocket: client });
	}

	handleUserConnectRequest(client: WebSocket, server: WebSocket, request: Request): Promise<Response> {
		// // Get the client's IP address for use with the rate limiter.
		// let ip = request.headers.get("CF-Connecting-IP")!;

		// let userId = request.headers.get('X-User-ID');

		this.state.acceptWebSocket(server);

		console.log('[Community] Sending connected message');
		const communityConnectedMessage: ConnectedMessage = {
			from: {
				type: 'community',
				id: this.communityId!,
				stubId: this.state.id.toString(),
			},
			payload: {
				action: 'connected',
			},
			version: "1.0.0"
		};

		server.send(JSON.stringify(communityConnectedMessage));
		return Promise.resolve(new Response(null, { status: 101, webSocket: client }));
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
		console.log('[community] message', message)

		if (typeof message !== "string") {
			console.error(`[community] Expected string for messaged. Received ${typeof message}.`)
			return;
		}

		const meta: Metadata = ws.deserializeAttachment();

		switch (meta.type) {
			case "User":
				this.processUserMessage(ws, message);
				break;
			case "Server":
				this.processServerMessage(ws, message);
		}
	}

	processUserMessage(ws: WebSocket, message: string) {
    console.log("[community] Received user message: ", message);
	}

	processServerMessage(ws: WebSocket, message: string) {

	}

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[community] Connection closed with code ${code}. ${reason} / ${wasClean}`);

		const meta: Metadata = ws.deserializeAttachment();

		switch (meta.type) {
			case "Server":
				this.serverWebSocketClose(ws, meta);
				break;
			case "User":
				this.userWebSocketClose(ws, meta);
		}
		ws.close();
	}

	serverWebSocketClose(ws: WebSocket, meta: ServerMetadata) {

	}

	userWebSocketClose(ws: WebSocket, meta: UserMetadata) {

	}

	webSocketError(ws: WebSocket, error: unknown) {
		console.log('[community] error', error);
	}
}
