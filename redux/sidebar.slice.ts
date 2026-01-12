import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState:true,
  reducers: {
    toggleSidebar:(state) => {
        return !state
    }
  },
});

export const { toggleSidebar} = sidebarSlice.actions;
export default sidebarSlice.reducer;
