import { WebsocketMessage, isValidWebsocketMessage } from '~/shared/types/shared/websocketMessage';

export const parseMessage = (messageEvent: WebSocketEventMap['message']): WebsocketMessage | undefined => {
  let data = messageEvent.data;

  // Check if data is ArrayBuffer and convert it to string
  if (data instanceof ArrayBuffer) {
      // Convert ArrayBuffer to string
      const decoder = new TextDecoder('utf-8');
      data = decoder.decode(data);
  } else if (typeof data !== 'string') {
      // If data is neither ArrayBuffer nor string, return undefined
      return undefined;
  }

  try {
      // Parse the string to JSON
      const parsedMessage = JSON.parse(data);

      // Validate if the parsed object is of type WebsocketMessage
      if (isValidWebsocketMessage(parsedMessage)) {
          return parsedMessage;
      }
      return undefined;
  } catch (e) {
      // If parsing fails, return undefined
      return undefined;
  }
};
