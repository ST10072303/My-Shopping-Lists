// helper function from Redux Toolkit to set up the Redux store
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import shoppingListReducer from "./shoppingListSlice";

// Creating and exporting Redux store 
export const store = configureStore({
  // root reducer object 
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;