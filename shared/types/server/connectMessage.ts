import { isSemanticVersion, isVersionLessThan } from "~/shared/lib/utils";
import { WebsocketMessage } from "../shared/websocketMessage";

export interface ConnectedMessage extends WebsocketMessage {
  to: string;
  payload: {
    action: 'connected'
  }
  version: "1.0.0";
}

// export function isValidConnectRequestMessage(obj: any): obj is ConnectRequestMessage {
//   return (
//     obj &&
//     typeof obj.type === 'string' && obj.type === "connect/request" &&
//     typeof obj.version === 'string' && isSemanticVersion(obj.version) && isVersionLessThan(obj.version, "2.0.0") &&
//     obj.payload &&
//     typeof obj.payload.serverId === 'string'
//   );
// }