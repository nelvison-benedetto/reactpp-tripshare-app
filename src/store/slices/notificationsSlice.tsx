import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {NotificationDBFormat} from "../../types/db";

interface NotificationsState {
  items: NotificationDBFormat[];
}

const initialState: NotificationsState ={
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationDBFormat>) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
