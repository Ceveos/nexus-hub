import { Tuple, combineReducers, configureStore } from "@reduxjs/toolkit";
import pusherReducer from "./slices/pusherSlice";
import pusherMiddleware from "./middleware/pusherMiddleware";

const rootReducer = combineReducers({
  pusher: pusherReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(pusherMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;