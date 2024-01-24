import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'


interface CommunityState {
  playerCount: number;
  maxPlayerCount: number;
}

interface ServerState {
  playerCount: number;
  maxPlayerCount: number;
}

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
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
})));



export default useWebsocketStore;