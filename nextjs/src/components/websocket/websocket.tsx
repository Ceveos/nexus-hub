'use client';

import useWebsocketStore from "./store";
import { type WebsocketMessage } from '~/shared/types/shared/websocketMessage';

const reconnectBaseDelay = 100; // Initial delay in milliseconds
const maxDelay = 5000; // Maximum delay cap in milliseconds

function connectWebSocket() {
  const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/client?action=connect`);
  useWebsocketStore.setState({ websocket });

  websocket.addEventListener("open", () => {
    console.log("Websocket connected");
    useWebsocketStore.setState({ connected: true, reconnectAttempts: 0});
  });

  websocket.addEventListener("close", () => {
    console.log("Websocket disconnected");
    useWebsocketStore.setState({ connected: false });
    if (useWebsocketStore.getState().listenerCount > 0) {
      attemptReconnect();
    }
  });

  websocket.addEventListener("error", (error) => {
    console.log("Websocket error: ", error);
  });

  websocket.addEventListener("message", (event) => {
    console.log("Websocket message:", event);
    onWebsocketMessage(event);
  });
}

function attemptReconnect() {
  let delay = reconnectBaseDelay * Math.pow(2, useWebsocketStore.getState().reconnectAttempts);
  delay = Math.min(delay, maxDelay); // Cap the delay at maxDelay
  useWebsocketStore.setState((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 }));

  setTimeout(connectWebSocket, delay);
  console.log(`Attempting to reconnect in ${delay}ms`);
}

useWebsocketStore.subscribe((state) => state.listenerCount, (listenerCount) => {
  console.log("Listeners:", listenerCount);

  if (listenerCount > 0 && !useWebsocketStore.getState().websocket) {
    console.log("Attempting to connect");
    connectWebSocket();
  }
});

function onWebsocketMessage(event: MessageEvent) {
  try {
    const data = JSON.parse(event.data as string) as WebsocketMessage;
    console.log("Websocket data:", data);
    if (!data.payload?.action) {
      console.log("No action received")
      return;
    }
    console.log("Action received:", data.payload.action);

    switch (data.payload.action) {
      case 'message':
        console.log("Message received:", data.payload.data);
        break;
    }

  } catch (error) {
    console.log("Error parsing websocket message:", error);
  }
}