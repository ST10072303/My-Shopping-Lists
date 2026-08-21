import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import shoppingListReducer from "./shoppingListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;