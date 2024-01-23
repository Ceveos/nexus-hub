import { Env } from '../env';
import { isValidMessage, isValidSubscribeMessage } from '~/shared/types/shared/websocketMessage';
import { WebsocketMetadata } from '../helpers/objectInteraction';

export class CommunityObject implements DurableObject {
	state: DurableObjectState;
	env: Env;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.env = env;
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request) {
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
		if (!isValidSubscribeMessage(requestData)) {
			return new Response('Invalid data format', { status: 400 });
		}

		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		server.serializeAttachment({ id: requestData.from, type: requestData.type } as WebsocketMetadata);
		this.state.acceptWebSocket(server, [requestData.type, requestData.from]);
		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    console.log('[community] message', message)
  }

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[community] Connection closed with code ${code}`);
		ws.close();
	}

	webSocketError(ws: WebSocket, error: unknown) {
    console.log('[community] error', error);
  }
}
