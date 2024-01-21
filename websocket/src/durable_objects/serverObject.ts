import { Env } from '../env';
import handleErrors from '../helpers/handleErrors';


interface Session {
  type: string;
}

interface ServerMetadata {
}

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
	private messages: Message[] = [];
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

	async addMessage(message: Message) {
		this.messages.push(message);
		if (this.messages.length > this.TRIM_THRESHOLD) {
			// Remove the oldest message(s) to maintain the cap
			this.messages.splice(0, this.messages.length - this.MAX_MESSAGES);
		}
		await this.saveMessages();
	}

	getMessages(page: number = 0, pageSize: number = 100): Message[] {
		const start = Math.max(this.messages.length - page * pageSize, 0);
		const end = Math.max(start - pageSize, 0);
		return this.messages.slice(end, start).reverse();
	}

	private async saveMessages() {
		await this.storage.put('messages', this.messages);
	}

	async fetch(request: Request) {
    if (!this.initialized) {
      await this.state.blockConcurrencyWhile(async () => {
        let storedMessages = await this.state.storage.get("messages") as Message[];
        this.messages = storedMessages || [];
        this.initialized = true;
      });
    }

		return await handleErrors(request, async () => {
			if (request.headers.get('Upgrade') != 'websocket') {
				return new Response('expected websocket', { status: 400 });
			}

			// Get the client's IP address for use with the rate limiter.
			let ip = request.headers.get('CF-Connecting-IP') || 'localhost';
			const webSocketPair = new WebSocketPair();
			const [client, server] = Object.values(webSocketPair);
      
      await this.handleSession(server, ip);
      
      return new Response(null, { status: 101, webSocket: client });
		});
	}

  async handleSession(webSocket: WebSocket, ip: string) {
    // Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
    // WebSocket in JavaScript, not sending it elsewhere.
    this.state.acceptWebSocket(webSocket);

    // // Queue "join" messages for all online users, to populate the client's roster.
    // for (let otherSession of this.sessions.values()) {
    //   if (otherSession.name) {
    //     session.blockedMessages.push(JSON.stringify({joined: otherSession.name}));
    //   }
    // }
  }
}
