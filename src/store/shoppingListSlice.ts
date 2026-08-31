import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../types/ShoppingItem";

// slice redux state structure
interface ShoppingListState {
  lists: ShoppingList[];
  loading: boolean;
  error: string | null;
}
// initial state when app first loads 
const initialState: ShoppingListState = {
  lists: [],
  loading: false,
  error: null,
};
// 
const shoppingListSlice = createSlice({name: "shoppingLists", initialState,
// functions that handle updates to the state
  reducers: {
    // Replaces the array of shopping lists 
    setShoppingLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },
    // Appends a single new shopping list to the end of the lists array
    addShoppingList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },
    // Find an existing list by ID and replaces it with new updated list 
    updateShoppingList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex(
        (list) => list.id === action.payload.id
      );

      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    // Removing shopping list from the array matching the passed string ID
    deleteShoppingList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(
        (list) => list.id !== action.payload
      );
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Setting error message or clearing it to null
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {setShoppingLists, addShoppingList, updateShoppingList, deleteShoppingList, setLoading, setError,
} = shoppingListSlice.actions;
// Export reducer function to main store (configureStore)
export default shoppingListSlice.reducer;