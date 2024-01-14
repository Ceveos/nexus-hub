import { WebsocketMessage } from "../shared/websocketMessage";

export interface MetadataRequestMessage extends WebsocketMessage {
  type: "metadata/request";
  version: "1.0.0";
}

export interface MetadatResponseaMessage extends WebsocketMessage {
  type: "metadata/response";
  version: "1.0.0";
  payload: {
    game: string;
    gameMode: string;
    name: string;
    port: number;
  }
}