import { Env } from "../env";

export interface Connection {
  type: string;
  id: string;
  ip: string;
}

export interface ClientConnection extends Connection {
  type: 'client';
}

export interface ServerConnection extends Connection {
  type: 'server';
}

export type ConnectionType = ClientConnection | ServerConnection;

export function validateConnectionType(data: any): data is ConnectionType {
  return data
      && typeof data === 'object'
      && 'type' in data
      && 'id' in data
      && 'ip' in data
      && (data.type === 'client' || data.type === 'server')
      && typeof data.id === 'string'
      && typeof data.ip === 'string';
}

export interface ChatMessage {
  from: string;
  message: string;
}

export interface Client {
  server: WebSocket
  ip: string
  lastSeen: number
}

export interface UserClient extends Client {}

export interface ServerClient extends Client {
  chatMessages: ChatMessage[]
}

export function ConnectToCommunity(request: Request, env: Env, communityId: string, data: ConnectionType): Promise<Response> {
  // Get the Durable Object stub for this room! The stub is a client object that can be used
	// to send messages to the remote Durable Object instance. The stub is returned immediately;
	// there is no need to await it. This is important because you would not want to wait for
	// a network round trip before you could start sending requests. Since Durable Objects are
	// created on-demand when the ID is first used, there's nothing to wait for anyway; we know
	// an object will be available somewhere to receive our requests.
	const communityObjectid = env.COMMUNITY.idFromName(communityId);
	const communityObject = env.COMMUNITY.get(communityObjectid);

	// Send the request to the object. The `fetch()` method of a Durable Object stub has the
	// same signature as the global `fetch()` function, but the request is always sent to the
	// object, regardless of the request's URL.
	return communityObject.fetch(request.url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
}