import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import mutualConnectionReducer from "./mutualConnectionSlice";
import receivedConnectionReducer from "./receivedConnectionSlice";
import sentConnectionReducer from "./sentConnectionSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    mutualConnection: mutualConnectionReducer,
    receivedConnection: receivedConnectionReducer,
    sentConnection: sentConnectionReducer,
  },
});

export default appStore;
