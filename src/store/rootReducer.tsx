import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationsReducer from "./slices/notificationsSlice";
import presenceReducer from "./slices/presenceSlice";
import chatReducer from "./slices/chatSlice";

export const rootReducer = combineReducers({
  ui: uiReducer,  //check on file store/slices/uiSlice x ALL info!!
  auth: authReducer,
  notifications: notificationsReducer,
  presence: presenceReducer,
  chat: chatReducer,
});


