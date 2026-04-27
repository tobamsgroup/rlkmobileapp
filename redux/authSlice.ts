import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    clearDeletionWarning(state) {
      if (state.user) {
        delete (state.user as any).deletionWarning;
      }
    },
  },
});

export const { login, logout, clearDeletionWarning } = authSlice.actions;
export default authSlice.reducer;
