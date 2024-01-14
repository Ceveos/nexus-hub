export interface WebsocketMessage {
  type: string;
  version: string;
  payload?: any;
}

// Helper function to validate if an object is of type WebsocketMessage
export function isValidWebsocketMessage(object: any): object is WebsocketMessage {
  // Check if 'type' and 'version' properties exist and are of type string
  const hasType = typeof object?.type === 'string';
  const hasVersion = typeof object?.version === 'string';

  // The 'payload' property is optional but must be checked if it exists
  const hasValidPayload = 'payload' in object ? true : true; // Adjust this condition if you have more specific criteria for 'data'

  return hasType && hasVersion && hasValidPayload;
}