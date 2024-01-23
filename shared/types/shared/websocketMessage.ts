export interface ChatMessage {
  from: string;
  text: string;
  timestamp: Date;
}

export type ConnectionType = 'client' | 'community' | 'server';
export type ConnectionAction = 'connect';
export type SubscriptionAction = 'subscribe' | 'unsubscribe';
export type MessageAction = 'message';

export interface Payload {
  action: string;
  data?: any;
}

export interface MessagePayload extends Payload {
  action: MessageAction;
  data: {
    from: string;
    message: string;
    timestamp?: number;
  };
}

export interface ConnectPayload extends Payload {
  action: ConnectionAction;
}

export interface SubscribePayload extends Payload {
  action: SubscriptionAction;
}

export interface Message {
  type: ConnectionType;
  to?: string;
  from?: string;
  payload?: Payload
}

export interface ServerMessage extends Message {
  type: 'server';
  to: string;
  from: string;
  payload: MessagePayload | SubscribePayload;
}

export interface CommunityMessage extends Message {
  type: 'community';
  to: string;
  from: string;
  action: MessageAction | SubscriptionAction;
}

export interface ClientMessage extends Message {
  type: 'client';
  to: string;
  from: string;
  action: MessageAction | SubscriptionAction;
}

export interface ConnectMessage extends Message {
  type: 'client' | 'server';
  to: never;
  from: string;
  payload: ConnectPayload;
}

export interface SubscribeMessage extends Message {
  type: 'community' | 'server';
  to: string;
  from: string;
  payload: SubscribePayload;
}

export function isValidPayload(data: any): data is Payload {
  return data
      && typeof data === 'object'
      && 'action' in data
      && typeof data.action === 'string';
}

export function isValidMessage(data: any): data is Message {
  return data
      && typeof data === 'object'
      && 'type' in data
      && (!('to' in data) || typeof data.to === 'string')
      && (!('from' in data) || typeof data.from === 'string')
      && 'payload' in data
      && (data.type === 'client' || data.type === 'community' || data.type === 'server')
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

export function isValidConnectMessage(data: any): data is ConnectMessage {
  return data
    && isValidMessage(data)
    && data.type === 'client' || data.type === 'server'
    && isValidConnectPayload(data.payload);
}

export function isValidSubscribeMessage(data: any): data is SubscribeMessage {
  return data
    && isValidMessage(data)
    && data.type === 'community' || data.type === 'server'
    && isValidPayload(data.payload)
    && isValidSubscriptionPayload(data.payload);
}

export interface WebsocketMessage extends Message {
  version: string;
}

// Helper function to validate if an object is of type WebsocketMessage
export function isValidWebsocketMessage(object: any): object is WebsocketMessage {
  return typeof object?.version === 'string' && isValidMessage(object);
}