import { Env } from '../env';
import { ServerClient, ServerMessage, UserClient, validateMessage } from '../helpers/objectInteraction';

export interface Message {
  from: string;
  text: string;
  timestamp: Date;
}


export class CommunityObject implements DurableObject {
	state: DurableObjectState;
	env: Env;
	servers: Map<string, Server> = new Map();
	users: Map<string, UserClient> = new Map();

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.env = env;
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request) {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		const requestData = await request.json();

		// Runtime type validation
		if (!validateMessage(requestData)) {
			return new Response('Invalid data format', { status: 400 });
		}

		switch (requestData.to) {
			case 'server':
				return await this.serverRequest(requestData);
		}

		// Durable Object storage is automatically cached in-memory, so reading the
		// same key every request is fast. (That said, you could also store the
		// value in a class member if you prefer.)
		let value: number = (await this.state.storage?.get('value')) || 0;

		// We don't have to worry about a concurrent request having modified the
		// value in storage because "input gates" will automatically protect against
		// unwanted concurrency. So, read-modify-write is safe. For more details,
		// see: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
		await this.state.storage?.put('value', value);

		return new Response(value.toString());
	}

	async serverRequest(connection: ServerMessage): Promise<any> {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);

		server.addEventListener('close', async (event) => {
			console.log(`[server] Connection closed with code ${event.code}`);
			server.close();
		});

		server.accept();
		// server.send(JSON.stringify(metadataReq));

		this.servers.set(connection.id, new Server(this.state, this.env, {
			ip: connection.ip,
			lastSeen: Date.now(),
			server
		}));

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}
}
