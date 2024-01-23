export interface ChatMessage {
  from: string;
  text: string;
  timestamp: Date;
}

export type ConnectionType = 'client' | 'community' | 'server';
export type ConnectAction = 'connect';
export type ConnectedAction = 'connected';
export type SubscriptionAction = 'subscribe' | 'unsubscribe';
export type MessageAction = 'message';

export type MetadataAction = 'metadata/request' | 'metadata/response' | 'metadata/invalid';
export type RegisteredAction = 'registered'

export type Action = 
  | ConnectAction
  | ConnectedAction
  | SubscriptionAction
  | MessageAction
  | MetadataAction
  | RegisteredAction;



interface PayloadBase {
  action: Action;
  data?: any;
}
export interface MessagePayload extends PayloadBase {
  action: MessageAction;
  data: {
    from: string;
    message: string;
    timestamp?: number;
  };
}

export interface ConnectPayload extends PayloadBase {
  action: ConnectAction;
  data?: never;
}

export interface ConnectedPayload extends PayloadBase {
  action: ConnectedAction;
  data?: never;
}

export interface SubscribePayload extends PayloadBase {
  action: SubscriptionAction;
  data?: never;
}

export interface MetadataRequestPayload extends PayloadBase {
  action: 'metadata/request';
  data?: never;
}

export interface MetadataInvalidPayload extends PayloadBase {
  action: 'metadata/invalid';
  data?: never;
}

export interface MetadataResponsePayload extends PayloadBase {
  action: 'metadata/response';
  data: {
    game: string;
    gameMode: string;
    name: string;
    port: number;
  }
}

export interface ServerRegisteredPayload extends PayloadBase {
  action: 'registered';
  data: {
    serverId: string;
  }
}

export type Payload =
  | MessagePayload
  | ConnectPayload
  | ConnectedPayload
  | SubscribePayload
  | MetadataRequestPayload
  | MetadataInvalidPayload
  | MetadataResponsePayload
  | ServerRegisteredPayload;

export type Connection = {
  type: ConnectionType;
  id: string;
  stubId?: string;
}

export interface Message {
  to?: Connection;
  from?: Connection;
  payload?: Payload
}

export interface ServerMessage extends Message {
  to: {
    type: 'server',
    id: string;
    stubId?: string;
  }
  payload: MessagePayload | SubscribePayload;
}

export interface CommunityMessage extends Message {
  to: {
    type: 'community',
    id: string;
    stubId?: string;
  }
  from: Connection;
  action: MessageAction | SubscriptionAction;
}

export interface ClientMessage extends Message {
  to: {
    type: 'client',
    id: string;
    stubId?: string;
  }
  from: Connection;
  action: MessageAction | SubscriptionAction;
}

export interface SubscribeMessage extends Message {
  to?: Connection;
  from: Connection;
  payload: SubscribePayload;
}

export function isValidPayload(data: any): data is Payload {
  return data
      && typeof data === 'object'
      && 'action' in data
      && typeof data.action === 'string';
}

export function isValidConnection(data: any): data is Connection {
  return data
      && typeof data === 'object'
      && 'type' in data
      && typeof data.type === 'string'
      && 'id' in data
      && typeof data.id === 'string'
      && (!('stubId' in data) || typeof data.stubId === 'string');
}

export function isValidMessage(data: any): data is Message {
  return data
      && typeof data === 'object'
      && (!('to' in data) || isValidConnection(data.to))
      && (!('from' in data) || isValidConnection(data.from))
      && 'payload' in data
      && isValidPayload(data.payload);
}


export function isValidConnectPayload(data: any): data is ConnectPayload {
  return data
    && isValidPayload(data)
    && data.action === 'connect'
}

export function isValidSubscriptionPayload(data: any): data is SubscribePayload {
  return data
    && isValidPayload(data)
    && (data.action === 'subscribe' || data.action === 'unsubscribe');
}

export function isValidSubscribeMessage(data: any): data is SubscribeMessage {
  return data
    && isValidMessage(data)
    && isValidSubscriptionPayload(data.payload);
}

export interface WebsocketMessage extends Message {
  version: string;
}

// Helper function to validate if an object is of type WebsocketMessage
export function isValidWebsocketMessage(object: any): object is WebsocketMessage {
  return typeof object?.version === 'string' && isValidMessage(object);
}