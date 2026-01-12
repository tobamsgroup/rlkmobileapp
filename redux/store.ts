import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from './sidebar.slice'
import authReducer from './authSlice'


const store = configureStore({ reducer: {
    sidebar: sidebarReducer,
    auth: authReducer
} });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

export default store;
