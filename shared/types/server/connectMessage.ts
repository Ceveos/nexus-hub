import { WebsocketMessage } from "../shared/websocketMessage";

export interface ConnectRequestMessage extends WebsocketMessage {
  type: "connect/request";
  version: "1.0.0";
  payload: {
    serverId: string;
  }
}