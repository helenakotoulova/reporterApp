import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
import reportsReducer from "./reportsSlice";

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
