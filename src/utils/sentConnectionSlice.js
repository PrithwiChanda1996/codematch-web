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
    removeSentConnectionById: (state, action) => {
      if (state && Array.isArray(state)) {
        return state.filter((connection) => connection._id !== action.payload);
      }
      return state;
    },
  },
});

export const {
  setsentConnections,
  removesentConnections,
  removeSentConnectionById,
} = sentConnectionSlice.actions;
export default sentConnectionSlice.reducer;
