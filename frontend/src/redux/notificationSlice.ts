import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  message: string | null;
  severity: "success" | "error" | null;
}

const initialState: NotificationState = {
  message: null,
  severity: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (
      state,
      action: PayloadAction<{ message: string; severity: "success" | "error" }>
    ) => {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    clearNotification: (state) => {
      state.message = null;
      state.severity = null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
