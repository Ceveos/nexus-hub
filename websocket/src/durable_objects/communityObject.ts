import { Env } from '../env';
import { Action, SubscribeMessage } from '~/shared/types/shared/websocketMessage';
import handleErrors from '../helpers/handleErrors';

export class CommunityObject implements DurableObject {
	state: DurableObjectState;
	env: Env;
	communityId?: string;
	initialized: boolean = false;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.env = env;
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

		this.initialized = true;
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

			if (!this.initialized) await this.initialize(communityId);

			if (this.communityId !== communityId) {
				return new Response('Community ID does not match expected', { status: 401 });
			}

			const action = searchParams.get('action');
			switch (action as Action) {
				case 'subscribe':
					return this.subscribeHandler();
				default:
					return new Response('Invalid action', { status: 404 });
			}
		});
	}

	async subscribeHandler(): Promise<Response> {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		const communityConnectedMessage: SubscribeMessage = {
			from: {
        type: 'community',
        id: this.communityId!,
        stubId: this.state.id.toString(),
      },
			payload: {
				action: 'subscribed',
			},
		};

    this.state.acceptWebSocket(server);

    console.log('[Community] Sending connected message');
		server.send(JSON.stringify(communityConnectedMessage));
		return new Response(null, { status: 101, webSocket: client });
	}

	webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    console.log('[community] message', message)
  }

	webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		console.log(`[community] Connection closed with code ${code}. ${reason} / ${wasClean}`);
		ws.close();
	}

	webSocketError(ws: WebSocket, error: unknown) {
    console.log('[community] error', error);
  }
}
