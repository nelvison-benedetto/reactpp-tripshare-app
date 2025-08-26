import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatState {
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId → messages
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
      state, action: PayloadAction<{ conversationId: string; message: Message }>
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
