import { isSemanticVersion, isVersionLessThan } from "~/shared/lib/utils";

import { MetadataInvalidPayload, MetadataRequestPayload, MetadataResponsePayload, ServerRegisteredPayload, WebsocketMessage, isValidMessage, isValidPayload } from "../shared/websocketMessage";

export interface MetadataRequestMessage extends WebsocketMessage {
  to?: never;
  from?: never;
  version: "1.0.0";
  payload: MetadataRequestPayload
}

export interface MetadataInvalidMessage extends WebsocketMessage {
  to?: never;
  from?: never;
  version: "1.0.0";
  payload: MetadataInvalidPayload
}

export interface MetadataResponseMessage extends WebsocketMessage {
  to?: never;
  from?: never;
  version: "1.0.0";
  payload: MetadataResponsePayload
}

export interface ServerRegisteredMessage extends WebsocketMessage {
  to?: never;
  from?: never;
  version: "1.0.0";
  payload: ServerRegisteredPayload
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