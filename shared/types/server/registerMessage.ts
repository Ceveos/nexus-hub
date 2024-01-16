import { isSemanticVersion, isVersionLessThan } from "~/shared/lib/utils";
import { WebsocketMessage } from "../shared/websocketMessage";

export interface MetadataRequestMessage extends WebsocketMessage {
  type: "metadata/request";
  version: "1.0.0";
}

export interface MetadataResponseMessage extends WebsocketMessage {
  type: "metadata/response";
  version: string;
  payload: {
    game: string;
    gameMode: string;
    name: string;
    port: number;
  }
}

export interface ServerRegisteredMessage extends WebsocketMessage {
  type: "server/registered";
  version: "1.0.0";
  payload: {
    serverId: string;
  }
}

export function isValidMetadataResponseMessage(obj: any): obj is MetadataResponseMessage {
  return (
    obj &&
    typeof obj.type === 'string' && obj.type === "metadata/response" &&
    typeof obj.version === 'string' && isSemanticVersion(obj.version) && isVersionLessThan(obj.version, "2.0.0") &&
    obj.payload &&
    typeof obj.payload.game === 'string' &&
    typeof obj.payload.gameMode === 'string' &&
    typeof obj.payload.name === 'string' &&
    typeof obj.payload.port === 'number'
  );
}