export interface ChatMessage {
  from: string;
  text: string;
  timestamp: Date;
}

export type ConnectionType = 'client' | 'community' | 'server';
export type ConnectionAction = 'connect' | 'message';
export type SubscriptionAction = | 'subscribe' | 'unsubscribe';
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
  to: string;
  from: string;
  payload?: Payload
}

export interface ServerMessage extends Message {
  type: 'server';
  action: MessageAction | SubscriptionAction | ConnectPayload;
}

export interface CommunityMessage extends Message {
  type: 'community';
  action: MessageAction | SubscriptionAction;
}

export interface ClientMessage extends Message {
  type: 'client';
  action: MessageAction | SubscriptionAction;
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
      && 'to' in data
      && 'from' in data
      && 'payload' in data
      && (data.type === 'client' || data.type === 'community' || data.type === 'server')
      && typeof data.to === 'string'
      && typeof data.from === 'string'
      && isValidPayload(data.payload);
}
export interface WebsocketMessage extends Message {
  version: string;
}

// Helper function to validate if an object is of type WebsocketMessage
export function isValidWebsocketMessage(object: any): object is WebsocketMessage {
  return typeof object?.version === 'string' && isValidMessage(object);
}