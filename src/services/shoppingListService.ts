import axios from "axios";
import type { ShoppingList } from "../types/ShoppingItem";

const API_URL = "http://localhost:3001/shoppingLists";
//read
export const getShoppingLists = async (
  userId: string
): Promise<ShoppingList[]> => {
  const response = await axios.get<ShoppingList[]>(
    `${API_URL}?userId=${userId}`);
  return response.data;
};

//create
export const createShoppingList = async (shoppingList: ShoppingList): Promise<ShoppingList> => {
  const response = await axios.post<ShoppingList>(API_URL, shoppingList);

  return response.data;
};

//update
export const updateShoppingList = async (shoppingList: ShoppingList ): Promise<ShoppingList> => {
  const response = await axios.put<ShoppingList>(`${API_URL}/${shoppingList.id}`, shoppingList);
  return response.data;
};

//delete
export const deleteShoppingList = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};