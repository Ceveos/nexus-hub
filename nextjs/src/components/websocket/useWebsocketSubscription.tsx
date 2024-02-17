"use client";

import { useEffect } from "react";
import useWebsocketStore from "./store";

export interface SubscriptionItem {
  type: 'community' | 'server';
  id: string;
}

export function useWebSocketSubscription(subscriptions: SubscriptionItem[]) {
  const { addListener, removeListener, subscribe, unsubscribe } = useWebsocketStore((state) => ({
    addListener: state.addListener,
    removeListener: state.removeListener,
    subscribe: state.subscribe,
    unsubscribe: state.unsubscribe,
  }));

  useEffect(() => {
    // Add as a general listener
    addListener();
    // Subscribe to specified items
    subscriptions.forEach(({ type, id }) => {
      subscribe(type, id);
    });

    // Cleanup function to remove listener and unsubscribe
    return () => {
      removeListener();
      subscriptions.forEach(({ type, id }) => {
        unsubscribe(type, id);
      });
    };
    // Depend on the subscriptions array so the effect is run again if it changes
  }, [subscriptions, addListener, removeListener, subscribe, unsubscribe]);
}
