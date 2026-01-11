import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    setFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      return null;
    },
    removeFirstUserFromFeed: (state, action) => {
      if (state && Array.isArray(state) && state.length > 0) {
        return state.slice(1);
      }
      return state;
    },
  },
});

export const { setFeed, removeFeed, removeFirstUserFromFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
