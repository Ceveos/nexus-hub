import { type Middleware } from 'redux';
import { type RootState } from '../store'; // Import the type of your root state
import { initializeServer, incrementComponentListener, decrementComponentListener, connect, disconnect } from '../slices/pusherSlice';
import PusherManager from '@/lib/pusherManager';

const pusherMiddleware: Middleware<object, RootState> = store => next => action => {
    let server;
    if (initializeServer.match(action)) {
        server = store.getState().pusher.servers[action.payload.appKey];
        if (server && PusherManager.exists(action.payload.appKey)) {
            return next(action);
        }
        // let pusher = PusherManager.getInstance(action.payload.appKey);

        // Listen for any connection state change
        // pusher.connection.bind('state_change', (states: PusherConnectionStateChangeCB) => {
        //     // states = {previous: 'oldState', current: 'newState'}
        //     console.log(`Connection state changed from ${states.previous} to ${states.current}`);
        //     // Dispatch appropriate actions based on the state
        // });

        // pusher.signin();
        // pusher.connection.bind('connected', () => {
        //     store.dispatch(connected(action.payload));
        // });
        // pusher.connection.bind('connected', () => {
        //     store.dispatch(connected(action.payload));
        // });

        // Handle authentication success/error
        // pusher.connection.bind('authenticated', (status: any) => {
        //     console.log("authenticated: ", status);
        //     store.dispatch(authenticated(action.payload));
        // });
        // pusher.connection.bind('unauthenticated', () => {
        //     store.dispatch(unauthenticated(action.payload));
        // });

    } else if (connect.match(action)) {
        if (!PusherManager.exists(action.payload.appKey)) {
            return next(action);
        }
        PusherManager.getInstance(action.payload.appKey).connect();
    } else if (disconnect.match(action)) {
        if (!PusherManager.exists(action.payload.appKey)) {
            return next(action);
        }
        PusherManager.getInstance(action.payload.appKey).disconnect();
    } else if (incrementComponentListener.match(action)) {
        const result = next(action); // Let the reducer handle the action first
        server = store.getState().pusher.servers[action.payload.appKey];

        // Create pusher instance if not exists
        if (!PusherManager.exists(action.payload.appKey)) {
            store.dispatch(initializeServer(action.payload))
        }
        // If connection state is disconnected, connect to server
        if (server && server.connectionState === 'disconnected') {
            store.dispatch(connect(action.payload))
        }
        return result;
    } else if (decrementComponentListener.match(action)) {
        const result = next(action); // Let the reducer handle the action first
        server = store.getState().pusher.servers[action.payload.appKey];

        if (!server) {
            return result;
        }

        // Check if the component listener count is 0
        if (server.componentListenerCount === 0) {
            // If it is, disconnect from Pusher
            store.dispatch(disconnect(action.payload))
        }

        return result;
    }

    return next(action);
};

export default pusherMiddleware;