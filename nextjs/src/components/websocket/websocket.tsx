'use client';

import useWebsocketStore from "./store";

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
    attemptReconnect();
  });

  websocket.addEventListener("error", (error) => {
    console.log("Websocket error: ", error);
  });

  websocket.addEventListener("message", (event) => {
    console.log("Websocket message:", event);
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