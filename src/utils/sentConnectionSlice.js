import { createSlice } from "@reduxjs/toolkit";

const sentConnectionSlice = createSlice({
  name: "sentConnection",
  initialState: null,
  reducers: {
    setsentConnections: (state, action) => {
      return action.payload;
    },
    removesentConnections: (state, action) => {
      return null;
    },
  },
});

export const { setsentConnections, removesentConnections } = sentConnectionSlice.actions;
export default sentConnectionSlice.reducer;