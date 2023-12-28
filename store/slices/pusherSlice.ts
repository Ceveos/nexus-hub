import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type PusherConnectionState = 
    | 'connecting'
    | 'connected'
    | 'unavailable'
    | 'failed'
    | 'disconnected';

export type PusherServer = {
  appKey: string
};

export type PusherConnectionStateChange = PusherServer & {
  state: PusherConnectionState
};


export interface PusherServerState {
  componentListenerCount: number,
  connectionState: PusherConnectionState,
}

export interface PusherState {
  servers: Record<string, PusherServerState>;
}

const initialServerState: PusherServerState = {
  componentListenerCount: 0,
  connectionState: 'disconnected'
}

const initialState: PusherState = {
  servers: {}
}

const pusherSlice = createSlice({
  name: 'pusher',
  initialState,
  reducers: {
    initializeServer: (_state, _action: PayloadAction<PusherServer>) => { },
    connect: (_state, _action: PayloadAction<PusherServer>) => { },
    disconnect: (_state, _action: PayloadAction<PusherServer>) => { },
    incrementComponentListener: (state, action: PayloadAction<PusherServer>) => {
      state.servers[action.payload.appKey] = state.servers[action.payload.appKey] ?? { ...initialServerState }
      const server = state.servers[action.payload.appKey];
      if (!server) return;
      server.componentListenerCount += 1;
    },
    connectionStateChange: (state, action: PayloadAction<PusherConnectionStateChange>) => {
      const server = state.servers[action.payload.appKey];
      if (!server) return;
      server.connectionState = action.payload.state;
    },
    decrementComponentListener: (state, action: PayloadAction<PusherServer>) => {
      const server = state.servers[action.payload.appKey];
      if (!server) return;
      if (server.componentListenerCount > 0) {
        server.componentListenerCount -= 1;
      }
    },
  },
});

export const { initializeServer, connect, disconnect, incrementComponentListener, connectionStateChange, decrementComponentListener } = pusherSlice.actions;
export default pusherSlice.reducer;