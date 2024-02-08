export {}

declare global {
  interface WebSocket {
    accept(): void;
    deserializeAttachment(): any;
    serializeAttachment(any): void;
  }

  interface Response {
    webSocket?: WebSocket;
  }

  class WebSocketPair {
    0: WebSocket;
    1: WebSocket;
  }

  interface ResponseInit {
    webSocket?: WebSocket;
  }
}