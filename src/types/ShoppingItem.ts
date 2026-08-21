export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  image: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  notes?: string;
  items: ShoppingItem[];
}