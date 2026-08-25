import { useState } from "react";
import styles from "./AddShoppingList.module.css";
import type { ShoppingItem, ShoppingList } from "../../types/ShoppingItem";

interface AddShoppingListProps {
  onCancel: () => void;
  onSave: (shoppingList: ShoppingList) => void;
}

export const AddShoppingList = ({onCancel, onSave,}: AddShoppingListProps) => {
  const [listName, setListName] = useState("");
  const [notes, setNotes] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const [items, setItems] = useState<ShoppingItem[]>([]);

  const handleAddItem = () => {
    if (!itemName.trim()) {
      return;
    }

    if (!category) {
      return;
    }

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      quantity,
      category,
      image,
    };

    setItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setItemName("");
    setQuantity(1);
    setCategory("");
    setImage("");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!listName.trim()) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    const newShoppingList: ShoppingList = {
      id: crypto.randomUUID(),
      userId: "",
      name: listName.trim(),
      notes: notes.trim(),
      items,
    };

    onSave(newShoppingList);
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.modal} aria-labelledby="add-shopping-list-title">
        <div className={styles.header}>
          <div>
            <h2>Add Shopping List</h2>
            <p>Create a list and add the items you need.</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Close add shopping list form">x</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="listName">List Name</label>
            <input type="text" value={listName}
              onChange={(event) => setListName(event.target.value)} placeholder="e.g. Weekly Groceries" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes"> Notes <span>(Optional)</span></label>

            <textarea value={notes} onChange={(event) => setNotes(event.target.value) }
              placeholder="Add any notes about this shopping list..." rows={3} />
          </div>

          <div className={styles.itemSection}>
            <h3>Add Items</h3>
            <div className={styles.itemForm}>
              <div className={styles.formGroup}>
                <label htmlFor="itemName">Item Name </label>
                <input type="text" value={itemName} onChange={(event) => setItemName(event.target.value) }
                  placeholder="e.g. Milk" />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(event) =>
                    setQuantity(Number(event.target.value))} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>

                <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="">Select category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Meat">Meat</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL</label>

                <input type="url" value={image} onChange={(event) => setImage(event.target.value)}placeholder="https://..." />
              </div>
            </div>

            <button type="button" className={styles.addItemButton} onClick={handleAddItem}> + Add Item </button>
          </div>

          {items.length > 0 && (
            <div className={styles.itemsPreview}>
              <h3>Items in this list ({items.length})</h3>

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
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>

            <button type="submit" className={styles.saveButton}>Create Shopping List</button>
          </div>
        </form>
      </section>
    </div>
  );
};