import { Env } from '../env';
import { ConnectionType, WebsocketMessage, isValidWebsocketMessage } from '~/shared/types/shared/websocketMessage';
import { WebsocketMetadata, subscribe, unsubscribe } from '../helpers/objectInteraction';
import { ConnectedMessage } from '~/shared/types/server/connectMessage';

export class ClientObject implements DurableObject {
	state: DurableObjectState;
	storage: DurableObjectStorage;
	env: Env;
	clientWs?: WebSocket;
	servers: string[] = [];
	communities: string[] = [];
	blockedMessages: string[] = [];
	initialized: boolean = false;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;
    this.initializeServers();
    this.initializeCommunities();
	}

	async initialize() {
		await this.initializeServers();
		await this.initializeCommunities();
		this.initialized = true;
	}

	async initializeServers() {
		this.servers = ((await this.state.storage.get('servers')) ?? []) as string[];

		this.servers.forEach((serverId) => {
			this.subscribe('server', serverId);
		});
	}

	async initializeCommunities() {
		this.communities = ((await this.state.storage.get('communities')) ?? []) as string[];

		this.communities.forEach((communityId) => {
			this.subscribe('community', communityId);
		});
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request) {
		if (!this.initialized) {
			await this.initialize();
		}


		// Handle client websocket connection
		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('Expected websocket', { status: 400 });
		}

		if (this.clientWs && this.clientWs.readyState === WebSocket.OPEN) {
			// This should never happen
			return new Response('Another client already connected', { status: 400 });
		}

		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		this.clientWs = server;

		// Should be empty but just in case
		await this.initializeCommunities();
		await this.initializeServers();

		this.state.acceptWebSocket(server, ['client']);

		server.send(
			JSON.stringify({
				payload: { action: 'connected' },
				version: '1.0.0',
			} as ConnectedMessage),
		);

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	broadcastMessage(message: Message) {
		const websockets = this.state.getWebSockets('client');
		for (let i = websockets.length - 1; i >= 0; i--) {
			const ws = websockets[i];
			const metadata = ws.deserializeAttachment() as WebsocketMetadata;

			if (ws.readyState === WebSocket.OPEN) {
				if (metadata.type === 'client') {
					ws.send(JSON.stringify(message));
				}
			} else {
				// Remove the WebSocket if it's not open
				switch (metadata.type) {
					case 'client':
						this.clientWs = undefined;
						// Todo: Create alarm for 30 seconds before killing durable object
						break;
					case 'server':
						this.servers = this.servers.filter((serverId) => serverId !== metadata.id);
						this.storage.put('servers', this.servers);
						break;
					case 'community':
						this.communities = this.communities.filter((communityId) => communityId !== metadata.id);
						this.storage.put('communities', this.communities);
						break;
				}
				websockets.splice(i, 1);
			}
		}
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
		console.log('[client] message', message);
		
		try {
			const parsedMessage = JSON.parse(message.toString());
			if (!isValidWebsocketMessage(parsedMessage)) {
				console.log('[community] invalid message', message);
				return;
			}

			if (this.clientWs === ws) {
				this.handleClientMessage(parsedMessage);
			} else {
				this.handleNonClientMessage(ws, parsedMessage);
			}

		} catch (e) {
			console.log('[server] invalid message', message);
			return;
		}
	}
	
	handleClientMessage(message: WebsocketMessage) {
		const { payload } = message;
		if (!payload) {
			return;
		}

		switch (payload.action) {
			default:
				console.log(`Unexpected client message action: ${message.payload?.action}`);
				break;
		}
	}

	handleNonClientMessage(ws: WebSocket, message: WebsocketMessage) {
		const { payload } = message;
		if (!payload) {
			return;
		}

		switch (payload.action) {
			default:
				console.log(`Unexpected message action: ${message.payload?.action}`);
				break;
		}
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[client] Connection closed with code ${code}`);
		ws.close();
    await this.state.storage.deleteAll(); 
	}

	async webSocketError(ws: WebSocket, error: unknown) {
		console.log('[client] error', error);
    await this.state.storage.deleteAll(); 
	}

	async subscribe(type: ConnectionType, to: string): Promise<boolean> {
		const response = await subscribe({type, id: to}, this.env);

		if (response.webSocket) {
			response.webSocket.serializeAttachment({ type, id: to } as WebsocketMetadata);
			this.state.acceptWebSocket(response.webSocket, [type, to]);

			switch (to) {
				case 'server':
					this.servers.push(to);
					this.storage.put('servers', this.servers);
					break;
				case 'community':
					this.communities.push(to);
					this.storage.put('communities', this.communities);
					break;
			}
			return true;
		}

		return false;
	}

	async unsubscribe(type: ConnectionType, to: string) {
		// Close websocket
		const websockets = this.state.getWebSockets(to);

		// Realistically this should only ever be 0 or 1 websockets
		for (let i = websockets.length - 1; i >= 0; i--) {
			const ws = websockets[i];
			const metadata = ws.deserializeAttachment() as WebsocketMetadata;

			if (metadata.type === type && metadata.id === to) {
				ws.close();
			}
		}

		switch (to) {
			case 'server':
				this.servers = this.servers.filter((serverId) => serverId !== to);
				this.storage.put('servers', this.servers);
				break;
			case 'community':
				this.communities = this.communities.filter((communityId) => communityId !== to);
				this.storage.put('communities', this.communities);
				break;
		}

    // Send unsubscribe message
    unsubscribe({type, id: to}, this.env);
	}
}
