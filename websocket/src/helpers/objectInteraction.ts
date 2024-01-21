import { ConnectionType, SubscribePayload, Message } from "~/shared/types/shared/websocketMessage";
import { Env } from "../env";



export interface Client {
  server: WebSocket
  ip: string
  lastSeen: number
}

export interface UserClient extends Client {}

export interface ServerClient extends Client {
}

function getDurableObject(from: ConnectionType, id: string,  env: Env) {
  switch (from) {
    case 'client':
      return env.CLIENT.get(env.CLIENT.idFromString(id));
    case 'community':
      return env.COMMUNITY.get(env.COMMUNITY.idFromString(id));
    case 'server':
      return env.SERVER.get(env.SERVER.idFromString(id));
  }
}

export function fetch(req: Request, env: Env, message: Message): Promise<Response> {
  const durableObject = getDurableObject(message.type, message.to, env);
  return durableObject.fetch(req, {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

export function send(message: Message, env: Env): Promise<Response> {
  const durableObject = getDurableObject(message.type, message.to, env);
  return durableObject.fetch('https://fake-url.com', {
    method: 'POST',
    headers: {
      "Upgrade": "websocket"
    },
    body: JSON.stringify(message),
  });
}

export function subscribe(type: ConnectionType, to: string, from: string, env: Env): Promise<Response> {
  return send({
    type,
    to,
    from,
    payload: {
      action: 'subscribe'
    } as SubscribePayload
  }, env);
}

export function unsubscribe(type: ConnectionType, to: string, from: string, env: Env): Promise<Response> {
  return send({
    type,
    to,
    from,
    payload: {
      action: 'unsubscribe'
    } as SubscribePayload
  }, env);
}

export interface WebsocketMetadata {
	type: ConnectionType;
	id: string; // Not the durable object id
}