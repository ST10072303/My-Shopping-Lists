import { useState } from "react";
import styles from "./EditItemModel.module.css";
import type { ShoppingItem, ShoppingList } from "../../types/ShoppingItem";

interface EditShoppingListProps {
  shoppingList: ShoppingList;
  onCancel: () => void;
  onSave: (shoppingList: ShoppingList) => void;
}

export const EditShoppingList = ({shoppingList, onCancel, onSave,}: EditShoppingListProps) => {
  const [listName, setListName] = useState(shoppingList.name);
  const [notes, setNotes] = useState(shoppingList.notes ?? "");
  const [items, setItems] = useState<ShoppingItem[]>(shoppingList.items);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const handleAddItem = () => {
    if (!itemName.trim() || !category) {
      return;
    }

    const newItem: ShoppingItem = {id: crypto.randomUUID(), name: itemName.trim(), quantity, category, image,};
    setItems((currentItems) => [...currentItems, newItem,]);
    setItemName("");
    setQuantity(1);
    setCategory("");
    setImage("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {event.preventDefault();
    if (!listName.trim() || items.length === 0) {
      return;
    }

    const updatedList: ShoppingList = {...shoppingList, name: listName.trim(), notes: notes.trim(), items,};
    onSave(updatedList);
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.modal} aria-labelledby="edit-shopping-list-title">
        <div className={styles.header}>
          <div>
            <h2>Edit Shopping List</h2>
            <p>Update your shopping list and its items.</p>
          </div>

          <button type="button" className={styles.closeButton} onClick={onCancel}aria-label="Close edit shopping list form">x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="editListName">List Name</label>
            <input type="text" value={listName} onChange={(event) => setListName(event.target.value)}required/>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="editNotes"> Notes <span>(Optional)</span></label>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)}rows={3}/>
          </div>

          <div className={styles.itemSection}>
            <h3>Add Item</h3>

            <div className={styles.itemForm}>
              <div className={styles.formGroup}>
                <label htmlFor="editItemName">Item Name</label>
                <input type="text" value={itemName} onChange={(event) => setItemName(event.target.value)}placeholder="e.g. Milk"/>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editQuantity">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}/>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editCategory">Category</label>

                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">Select category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Fruit">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Meat">Meat</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editImage">Image URL</label>
                <input type="url" value={image} onChange={(event) => setImage(event.target.value)}placeholder="https://..."/>
              </div>
            </div>

            <button type="button" className={styles.addItemButton} onClick={handleAddItem}>+ Add Item</button>
          </div>

          <div className={styles.itemsPreview}>
            <h3>Items ({items.length})</h3>

            {items.map((item) => (
              <div key={item.id} className={styles.previewItem}>
                <div>
                  <strong>{item.name}</strong>
                  <span>Quantity: {item.quantity}</span>
                  <span>Category: {item.category}</span>
                </div>

                <button type="button" className={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
            <button type="submit" className={styles.saveButton}>Save Changes</button>
          </div>
        </form>
      </section>
    </div>
  );
};