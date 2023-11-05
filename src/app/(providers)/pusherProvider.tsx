'use client';

import Pusher from "pusher-js";
import { createContext, useState, useCallback } from "react";

const APP_KEY = "app-key";

type Context = {
    pusher: Pusher;
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

    return (
        <PusherContext.Provider value={{ pusher }}>
            {children}
        </PusherContext.Provider>
    );
}