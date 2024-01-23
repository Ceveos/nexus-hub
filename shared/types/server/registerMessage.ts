import { isSemanticVersion, isVersionLessThan } from "~/shared/lib/utils";

import { WebsocketMessage, isValidMessage, isValidPayload } from "../shared/websocketMessage";

type MetadataAction = "metadata/request" | "metadata/response";
export interface MetadataRequestMessage extends WebsocketMessage {
  type: 'server';
  version: "1.0.0";
  payload: {
    action: "metadata/request"
  }
}
export interface MetadataResponseMessage extends WebsocketMessage {
  type: 'server';
  version: "1.0.0";
  payload: {
    action: "metadata/response"
    data: {
      game: string;
      gameMode: string;
      name: string;
      port: number;
    }
  }
}
export interface ServerRegisteredMessage extends WebsocketMessage {
  type: "server";
  version: "1.0.0";
  payload: {
    action: 'registered'
    data: {
      serverId: string;
    }
  }
}

export function isValidMetadataResponseMessage(obj: any): obj is MetadataResponseMessage {
  return (
    isValidMessage(obj) as any
    && obj.version
    && typeof obj.version === 'string' && isSemanticVersion(obj.version) && isVersionLessThan(obj.version, "2.0.0") &&
    isValidPayload(obj.payload) &&
    obj.payload.data &&
    typeof obj.payload.data.game === 'string' &&
    typeof obj.payload.data.gameMode === 'string' &&
    typeof obj.payload.data.name === 'string' &&
    typeof obj.payload.data.port === 'number'
  );
}