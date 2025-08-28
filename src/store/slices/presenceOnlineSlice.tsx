import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PresenceOnlineState {
  onlineUsers: string[];   //array di userId
}

const initialState: PresenceOnlineState = {
  onlineUsers: [],
};

const presenceOnlineSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    userOnline: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);  //aggiungilo
      }
    },
    userOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);  //toglilo
    },
  },
});

export const { userOnline, userOffline } = presenceOnlineSlice.actions;
export default presenceOnlineSlice.reducer;


