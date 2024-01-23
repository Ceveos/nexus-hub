import { Env } from '../env';
import { ConnectionType, isValidConnectMessage, isValidMessage } from '~/shared/types/shared/websocketMessage';
import { WebsocketMetadata, subscribe } from '../helpers/objectInteraction';
import { ConnectedMessage } from '~/shared/types/server/connectMessage';

export class ClientObject implements DurableObject {
	state: DurableObjectState;
	storage: DurableObjectStorage;
	env: Env;
	clientId?: string;
	clientWs?: WebSocket;
	servers: string[] = [];
	communities: string[] = [];
	blockedMessages: string[] = [];
	initialized: boolean = false;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.storage = state.storage;
		this.env = env;
	}

	async initialize() {
		this.clientId = (await this.storage.get('clientId')) as string;
		await this.initializeServers();
		await this.initializeCommunities();
		this.initialized = true;
	}

	async initializeServers() {
		this.servers = ((await this.state.storage.get('servers')) ?? []) as string[];

		if (!this.clientId) {
			return;
		}

		this.servers.forEach((serverId) => {
			this.subscribe('server', serverId);
		});
	}

	async initializeCommunities() {
		this.communities = ((await this.state.storage.get('communities')) ?? []) as string[];

		if (!this.clientId) {
			return;
		}

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

		// If not client websocket connection, then expect POST request
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const requestData = await request.json();

		// Runtime type validation
		if (!isValidConnectMessage(requestData)) {
			return new Response('Invalid data format', { status: 400 });
		}

		if (requestData.type !== 'client') {
			return new Response('This type cannot connect to client', { status: 400 });
		}

		if (this.clientId && requestData.from !== this.clientId) {
			return new Response('Different client already connected', { status: 400 });
		}

		if (this.clientWs?.readyState === WebSocket.OPEN) {
			// This should never happen
			return new Response('Client already connected', { status: 400 });
		}

		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		this.clientId = requestData.from;
		this.clientWs = server;
		this.storage.put('clientId', this.clientId);

		// Should be empty but just in case
		await this.initializeCommunities();
		await this.initializeServers();

		server.serializeAttachment({ id: requestData.from, type: requestData.type } as WebsocketMetadata);
		this.state.acceptWebSocket(server, [requestData.type, requestData.from]);

		server.send(JSON.stringify({ 
      type: 'client',
      to: requestData.from,
      payload: { action: 'connected' },
      version: '1.0.0' } as ConnectedMessage));

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
	}

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[client] Connection closed with code ${code}`);
		ws.close();
	}

	webSocketError(ws: WebSocket, error: unknown) {
		console.log('[client] error', error);
	}

	async subscribe(type: ConnectionType, to: string): Promise<boolean> {
		if (!this.clientId) {
			return false;
		}

		const response = await subscribe(type, to, this.clientId, this.env);

		// Double-check that Response.webSocket is defined
		// https://developers.cloudflare.com/workers/runtime-apis/response/
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

	async unsubscribe(to: ConnectionType, id: string) {
		// Close websocket
		const websockets = this.state.getWebSockets(id);

		// Realistically this should only ever be 0 or 1 websockets
		for (let i = websockets.length - 1; i >= 0; i--) {
			const ws = websockets[i];
			const metadata = ws.deserializeAttachment() as WebsocketMetadata;

			if (metadata.type === to && metadata.id === id) {
				ws.close();
			}
		}

		switch (to) {
			case 'server':
				this.servers = this.servers.filter((serverId) => serverId !== id);
				this.storage.put('servers', this.servers);
				break;
			case 'community':
				this.communities = this.communities.filter((communityId) => communityId !== id);
				this.storage.put('communities', this.communities);
				break;
		}
	}
}
