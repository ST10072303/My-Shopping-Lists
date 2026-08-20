export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
}