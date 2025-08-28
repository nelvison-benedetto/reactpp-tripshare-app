import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {MessageDBFormat} from "../../types/db";

interface ChatState {
  activeConversationId: string | null;
  messages: Record<string, MessageDBFormat[]>; // conversationId → messages
}

const initialState: ChatState = {
  activeConversationId: null,
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (
      state, action: PayloadAction<{ conversationId: string; message: MessageDBFormat }>
    ) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    clearConversation: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
  },
});

export const { setActiveConversation, addMessage, clearConversation } = chatSlice.actions;
export default chatSlice.reducer;
