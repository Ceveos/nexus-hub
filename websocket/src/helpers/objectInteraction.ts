import { ConnectionType, SubscribePayload, Message, isValidMessage, Connection } from "~/shared/types/shared/websocketMessage";
import { Env } from "../env";

export interface Client {
  server: WebSocket
  ip: string
  lastSeen: number
}

export interface UserClient extends Client {}

export interface ServerClient extends Client {
}

export function getDurableObjectByName(type: ConnectionType, name: string, env: Env) {
  switch (type) {
    case 'client':
      return env.CLIENT.get(env.CLIENT.idFromName(name));
    case 'community':
      return env.COMMUNITY.get(env.COMMUNITY.idFromName(name));
    case 'server':
      return env.SERVER.get(env.SERVER.idFromName(name));
  }
}

export function getDurableObjectById(type: ConnectionType, id: string, env: Env) {
  switch (type) {
    case 'client':
      return env.CLIENT.get(env.CLIENT.idFromString(id));
    case 'community':
      return env.COMMUNITY.get(env.COMMUNITY.idFromString(id));
    case 'server':
      return env.SERVER.get(env.SERVER.idFromString(id));
  }
}

export async function send(message: Message, env: Env): Promise<Response> {
  if (!isValidMessage(message)) {
    return new Response(null, {status: 400, statusText: 'Invalid message format'})
  }

  if (!message.to) {
    return new Response(null, {status: 400, statusText: 'Missing destination'})
  }
  
  if (!message.payload) {
    return new Response(null, {status: 400, statusText: 'Missing payload'})
  }

  const action = message.payload.action;

  const url = new URL('https://fake-url.com');
  url.searchParams.append('action', action);
  url.searchParams.append('id', message.to.id);
  message.from && url.searchParams.append('from', message.from.id);
  message.from?.stubId && url.searchParams.append('fromStub', message.from.stubId);
  message.payload.data && url.searchParams.append('data', JSON.stringify(message.payload.data));

  const durableObject = message.to.stubId ? getDurableObjectById(message.to.type, message.to.stubId, env) : getDurableObjectByName(message.to.type, message.to.id, env);
  const resp = await durableObject.fetch(url.toString(), {
    headers: {
      "Upgrade": "websocket",
    }
  });

  return resp;
}

export function subscribe(to: Connection, env: Env): Promise<Response> {
  return send({
    to,
    payload: {
      action: 'subscribe'
    } as SubscribePayload
  }, env);
}

export function unsubscribe(to: Connection, env: Env): Promise<Response> {
  return send({
    to,
    payload: {
      action: 'unsubscribe'
    } as SubscribePayload
  }, env);
}

export interface WebsocketMetadata {
	type: ConnectionType;
	id: string; // Not the durable object id
}