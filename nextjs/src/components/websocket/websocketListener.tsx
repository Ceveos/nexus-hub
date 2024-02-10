"use client";

import { useEffect } from "react";
import useWebsocketStore from "./store";

interface SubscriptionItem {
  type: 'community' | 'server';
  id: string;
}

interface WebsocketListenerProps {
  subscriptions: SubscriptionItem[];
}

const WebsocketListener: React.FC<WebsocketListenerProps> = ({ subscriptions }) => {
  const { addListener, removeListener, subscribe, unsubscribe } = useWebsocketStore(state => ({
    addListener: state.addListener,
    removeListener: state.removeListener,
    subscribe: state.subscribe,
    unsubscribe: state.unsubscribe,
  }));

  useEffect(() => {
    // Always add as a general listener
    addListener();

    // Subscribe to all specified items
    subscriptions.forEach(({ type, id }) => {
      subscribe(type, id);
    });

    // Cleanup function to remove listener and unsubscribe from all items
    return () => {
      removeListener();
      subscriptions.forEach(({ type, id }) => {
        unsubscribe(type, id);
      });
    };
    // Ensure the effect re-runs only if the subscriptions array changes
  }, [subscriptions, addListener, removeListener, subscribe, unsubscribe]);

  return null;
};

export default WebsocketListener;