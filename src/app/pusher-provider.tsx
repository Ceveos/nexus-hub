'use client';

import Pusher from "pusher-js";
import { createContext, useState, useCallback } from "react";

const APP_KEY = "app-key";

type Context = {
    pusher: Pusher;
    subscribe: (channelName: string, eventName: string, callback: Function) => void;
    unsubscribe: (channelName: string, eventName: string) => void;
};
export const PusherContext = createContext<Context | undefined>(undefined);

type ProviderProps = {
    children: React.ReactNode;
};

export default function PusherProvider({ children }: ProviderProps) {
    // Initialize the pusher instance
    const pusher = new Pusher(APP_KEY, {
        cluster: '',
        wsHost: '127.0.0.1',
        wsPort: 6001,
        wssPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'http://localhost:3000/broadcasting/auth',
        userAuthentication: {
            endpoint: 'http://localhost:3000/pusher/user-auth',
            transport: 'ajax',
        }
    });


    pusher.bind_global((callback: any) => {
        console.log("[Pusher] ", callback);
    });

    pusher.user.bind_global((callback: any) => {
        console.log("[Pusher - User] ", callback);
    });

    pusher.signin();

    // Event and channel counter
    const [counters, setCounters] = useState<Record<string, Record<string, number>>>({}); // e.g. { 'my-channel': { 'my-event': 2 }}

    const subscribe = useCallback((channelName: string, eventName: string, callback: Function) => {
        let channel = pusher.channel(channelName);
        if (!channel) {
            channel = pusher.subscribe(channelName);
        }

        channel.bind(eventName, callback);

        // Update the counters
        setCounters(prev => {
            const updated = { ...prev };
            updated[channelName] = updated[channelName] ?? {};
            updated[channelName]![eventName] = (updated[channelName]![eventName] || 0) + 1;
            return updated;
        });
    }, [pusher]);

    const unsubscribe = useCallback((channelName: string, eventName: string) => {
        const channel = pusher.channel(channelName);
        if (channel) {
            // Update the counters
            setCounters(prev => {
                const updated = { ...prev };
                if (updated[channelName] && updated[channelName]![eventName]) {
                    updated[channelName]![eventName] -= 1;
    
                    // Unbind the event if no components are listening to it
                    if (updated[channelName]![eventName] === 0) {
                        channel.unbind(eventName);
                    }
                }
                return updated;
            });
        }
    }, [pusher]);

    return (
        <PusherContext.Provider value={{ pusher, subscribe, unsubscribe }}>
            {children}
        </PusherContext.Provider>
    );
}