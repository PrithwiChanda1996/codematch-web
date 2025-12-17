import { createSlice } from "@reduxjs/toolkit";

const mutualConnectionSlice = createSlice({
  name: "mutualConnection",
  initialState: null,
  reducers: {
    setMutualConnections: (state, action) => {
      return action.payload;
    },
    removeMutualConnections: (state, action) => {
      return null;
    },
  },
});

export const { setMutualConnections, removeMutualConnections } = mutualConnectionSlice.actions;
export default mutualConnectionSlice.reducer;