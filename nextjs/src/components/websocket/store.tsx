import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'

interface BaseState {
  listeners: number;
  websocket?: WebSocket;
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

type SubscriptionType = 'community' | 'server';

interface WebsocketState {
  websocket: WebSocket | null;
  connected: boolean;
  authenticated: boolean;
  listenerCount: number;
  reconnectAttempts: number;
  communities: Map<string, CommunityState>; 
  servers: Map<string, ServerState>;
  addListener: () => void;
  removeListener: () => void;
  subscribe: (type: SubscriptionType, id: string) => void;
  unsubscribe: (type: SubscriptionType, id: string) => void;
  setAuthenticated: (authenticated: boolean) => void;
}

const useWebsocketStore = create<WebsocketState>()(subscribeWithSelector((set) => ({
  websocket: null,
  connected: false,
  authenticated: false,
  listenerCount: 0,
  reconnectAttempts: 0,
  communities: new Map(),
  servers: new Map(),
  addListener: () => set((state) => ({ listenerCount: state.listenerCount + 1 })),
  removeListener: () => set((state) => ({ listenerCount: state.listenerCount - 1 })),
  subscribe: (type, id) => set((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id) || { listeners: 0, state: 'disconnected', playerCount: 0, maxPlayerCount: 0 };
    map.set(id, { ...current, listeners: current.listeners + 1 });
    return { [type === 'community' ? 'communities' : 'servers']: new Map(map) }; // ensure immutability
  }),
  unsubscribe: (type, id) => set((state) => {
    const map = type === 'community' ? state.communities : state.servers;
    const current = map.get(id);
    if (current && current.listeners > 1) {
      map.set(id, { ...current, listeners: current.listeners - 1 });
    } else {
      map.delete(id);
    }
    return { [type === 'community' ? 'communities' : 'servers']: new Map(map) }; // ensure immutability
  }),  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
})));



export default useWebsocketStore;