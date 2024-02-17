'use client';

import useWebsocketStore, { type SubscriptionType, type SubscriptionUpdate } from "./store";
import { type SubscribeMessage, type WebsocketMessage } from '~/shared/types/shared/websocketMessage';

const reconnectBaseDelay = 100; // Initial delay in milliseconds
const maxDelay = 5000; // Maximum delay cap in milliseconds

function connectWebSocket() {
  const websocket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/client?action=connect`);
  useWebsocketStore.setState({ websocket });

  websocket.addEventListener("open", () => {
    console.log("Websocket connected");
    useWebsocketStore.setState({ connected: true, fullRefreshRequired: true, reconnectAttempts: 0 });
  });

  websocket.addEventListener("close", () => {
    console.log("Websocket disconnected");

    useWebsocketStore.getState().disconnected();
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

useWebsocketStore.subscribe((state) => state.listenerCount, (listenerCount) => {
  console.log("Listeners:", listenerCount);

  if (listenerCount > 0 && !useWebsocketStore.getState().websocket) {
    console.log("Attempting to connect");
    connectWebSocket();
  }
});

useWebsocketStore.subscribe((state) => state.fullRefreshRequired, (fullRefreshRequired) => {
  if (!fullRefreshRequired) return;
  console.log("Performing full refresh");
  const { communities, servers } = useWebsocketStore.getState();
  const pendingSubscriptionUpdate: SubscriptionUpdate[] = Array.from(communities.keys()).map((id) => ({ type: 'community', id }));
  pendingSubscriptionUpdate.push(...Array.from(servers.keys()).map((id) => ({ type: 'server', id } as SubscriptionUpdate)));
  useWebsocketStore.setState({ fullRefreshRequired: false, pendingSubscriptionUpdate: pendingSubscriptionUpdate });
});

useWebsocketStore.subscribe((state) => state.pendingSubscriptionUpdate, (pendingSubscriptionUpdate) => {
  const { communities, servers } = useWebsocketStore.getState();
  for (const { type, id } of pendingSubscriptionUpdate) {
    const item = type === 'community' ? communities.get(id) : servers.get(id);
    if (!item) continue;
    if (item.listeners <= 0 && item.state !== 'disconnected') {
      console.log(`Disconnecting from ${type} ${id}`);
      disconnect(id, type);
    } else if (item.listeners > 0 && item.state === 'disconnected') {
      console.log(`Connecting to ${type} ${id}`);
      connect(id, type);
    }
  }
  if (pendingSubscriptionUpdate.length > 0) {
    useWebsocketStore.setState({ pendingSubscriptionUpdate: [] });
  }
});

useWebsocketStore.subscribe((state) => state.connected, (connected) => {
  const { pendingMessages } = useWebsocketStore.getState();
  if (connected && pendingMessages.length > 0) {
    console.log("Sending pending messages");
    pendingMessages.forEach((message) => sendMessage(message));
  }
  if (pendingMessages.length > 0) {
    useWebsocketStore.setState({ pendingMessages: [] });
  }
});

function sendMessage(message: WebsocketMessage) {
  const ws = useWebsocketStore.getState().websocket;
  if (!ws || ws.readyState !== ws.OPEN) {
    useWebsocketStore.setState((state) => ({ pendingMessages: [...state.pendingMessages, message] }));
    return;
  } else {
    ws.send(JSON.stringify(message));
  }
}

function connect(id: string, type: SubscriptionType) {
  const message: SubscribeMessage & WebsocketMessage = {
    to: {
      id,
      type
    },
    payload: {
      action: 'subscribe',
    },
    version: '1.0.0'
  };
  sendMessage(message);

  useWebsocketStore.setState((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id);
    if (!current) return state;
    map.set(id, { ...current, state: 'connecting' });
    return { [type === 'community' ? 'communities' : 'servers']: new Map(map) };
  });
}

function disconnect(id: string, type: SubscriptionType) {
  const message: SubscribeMessage & WebsocketMessage = {
    to: {
      id,
      type
    },
    payload: {
      action: 'unsubscribe',
    },
    version: '1.0.0'
  };
  sendMessage(message);

  useWebsocketStore.setState((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id);
    if (!current) return state;
    map.set(id, { ...current, state: 'disconnected' });
    return { [type === 'community' ? 'communities' : 'servers']: new Map(map) };
  });
}