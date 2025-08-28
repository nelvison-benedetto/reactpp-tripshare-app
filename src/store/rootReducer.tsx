import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationsReducer from "./slices/notificationsSlice";
import presenceReducer from "./slices/presenceOnlineSlice";
import chatReducer from "./slices/chatSlice";
import postsReducer from "./slices/postsSlice";

export const rootReducer = combineReducers({
  ui: uiReducer,  //check on file store/slices/uiSlice x ALL info!!
  auth: authReducer,
  notifications: notificationsReducer,
  presence: presenceReducer,
  chat: chatReducer,
  posts: postsReducer,
  
});


