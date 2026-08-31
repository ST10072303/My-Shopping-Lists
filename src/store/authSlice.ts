import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
// restore user when app starts
const savedUser = localStorage.getItem("shoppingAppUser");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: savedUser !== null,
};

const authSlice = createSlice({name: "auth", initialState, reducers: {login: (state, action: PayloadAction<User>) => {
  state.user = action.payload;
  state.isAuthenticated = true;
//save & remember logged-in user
  localStorage.setItem("shoppingAppUser", JSON.stringify(action.payload));
},

   logout: (state) => {
  state.user = null;
  state.isAuthenticated = false;
// remove user when logged out
  localStorage.removeItem("shoppingAppUser");
},

    updateUser: (state, action: PayloadAction<User>) => {state.user = action.payload;},
},
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;