import Pusher from 'pusher-js';

class PusherManager {
    private static instances: Record<string, Pusher> = {};

    static exists(appKey: string): boolean {
        return !!this.instances[appKey];
    }

    static getInstance(appKey: string): Pusher {
        if (!this.instances[appKey]) {
            this.instances[appKey] = new Pusher(appKey, {
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
        }

        return this.instances[appKey]!;
    }
}

export default PusherManager;