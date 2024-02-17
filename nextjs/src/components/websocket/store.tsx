import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { WebsocketMessage } from '~/shared/types/shared/websocketMessage';

interface BaseState {
  listeners: number;
  state: 'connecting' | 'connected' | 'disconnected';
}
interface CommunityState extends BaseState {
  playerCount: number;
  maxPlayerCount: number;
}

interface ServerState extends BaseState {
  playerCount: number;
  maxPlayerCount: number;
}

export type SubscriptionType = 'community' | 'server';

export type SubscriptionUpdate = {
  type:SubscriptionType
  id: string;
};

interface WebsocketState {
  websocket: WebSocket | null;
  pendingSubscriptionUpdate: SubscriptionUpdate[];
  pendingMessages: WebsocketMessage[];
  fullRefreshRequired: boolean;
  connected: boolean;
  authenticated: boolean;
  listenerCount: number;
  reconnectAttempts: number;
  communities: Map<string, CommunityState>; 
  servers: Map<string, ServerState>;
  disconnected: () => void;
  addListener: () => void;
  removeListener: () => void;
  subscribe: (type: SubscriptionType, id: string) => void;
  unsubscribe: (type: SubscriptionType, id: string) => void;
  setAuthenticated: (authenticated: boolean) => void;
}

const useWebsocketStore = create<WebsocketState>()(subscribeWithSelector((set) => ({
  websocket: null,
  pendingSubscriptionUpdate: [],
  pendingMessages: [],
  fullRefreshRequired: false,
  connected: false,
  authenticated: false,
  listenerCount: 0,
  reconnectAttempts: 0,
  communities: new Map(),
  servers: new Map(),
  disconnected: () => set((state) => {
    // Set all communities and servers to disconnected
    const communities: Map<string, CommunityState> = new Map([...state.communities].map(([id, community]) => [id, { ...community, state: 'disconnected' }]));
    const servers: Map<string, ServerState> = new Map([...state.servers].map(([id, server]) => [id, { ...server, state: 'disconnected' }]));
    return { communities, servers, connected: false, authenticated: false, fullRefreshRequired: true};
  }),
  addListener: () => set((state) => ({ listenerCount: state.listenerCount + 1 })),
  removeListener: () => set((state) => ({ listenerCount: state.listenerCount - 1 })),
  subscribe: (type, id) => set((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id) || { listeners: 0, state: 'disconnected', playerCount: 0, maxPlayerCount: 0 };
    map.set(id, { ...current, listeners: current.listeners + 1 });
    return { 
      [type === 'community' ? 'communities' : 'servers']: new Map(map),
      pendingSubscriptionUpdate: [...state.pendingSubscriptionUpdate, { type, id }],
     }; // ensure immutability
  }),
  unsubscribe: (type, id) => set((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id);
    if (current && current.listeners >= 1) {
      map.set(id, { ...current, listeners: current.listeners - 1 });
    }
    return { 
      [type === 'community' ? 'communities' : 'servers']: new Map(map),
      pendingSubscriptionUpdate: [...state.pendingSubscriptionUpdate, { type, id }],
     }; // ensure immutability
  }),
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
})));

export default useWebsocketStore;