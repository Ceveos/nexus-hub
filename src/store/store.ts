import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pusherReducer from "./slices/pusherSlice";
import pusherMiddleware from "./middleware/pusherMiddleware";
import logger from 'redux-logger'

const rootReducer = combineReducers({
  pusher: pusherReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(pusherMiddleware, logger)
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;