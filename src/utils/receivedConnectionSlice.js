import { createSlice } from "@reduxjs/toolkit";

const receivedConnectionSlice = createSlice({
  name: "receivedConnection",
  initialState: null,
  reducers: {
    setreceivedConnections: (state, action) => {
      return action.payload;
    },
    removereceivedConnections: (state, action) => {
      return null;
    },
  },
});

export const { setreceivedConnections, removereceivedConnections } = receivedConnectionSlice.actions;
export default receivedConnectionSlice.reducer;