import { useState } from "react";
import styles from "./AddShoppingList.module.css";
import type { ShoppingItem, ShoppingList } from "../../types/ShoppingItem";
import { searchPixabayImages, type PixabayImage } from "../../services/ApiService";

interface AddShoppingListProps {
  onCancel: () => void;
  onSave: (shoppingList: ShoppingList) => void;
}
// creating new shoping list
export const AddShoppingList = ({ onCancel, onSave, }: AddShoppingListProps) => {
  const [listName, setListName] = useState("");
  const [notes, setNotes] = useState("");
  // Current single item entry form states
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageSearch, setImageSearch] = useState("");
  // Pixabay image search UI states
  const [pixabayImages, setPixabayImages] = useState<PixabayImage[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageSearchError, setImageSearchError] = useState("");
  const [items, setItems] = useState<ShoppingItem[]>([]);

  //fetch image based on mageSearch query
  const handleSearchImages = async () => {
    // Guard clause: stop if query is empty or whitespace
    if (!imageSearch.trim()) {
      return;
    }
    setImageSearchError("");
    setIsSearchingImages(true);
    try {
      // Query Pixabay API service with trimmed search keyword
      const results = await searchPixabayImages(imageSearch.trim());

      setPixabayImages(results);
    } catch (error) {
      console.error("Failed to search Pixabay images:", error);
      setImageSearchError("Unable to search for images. Please try again.");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleAddItem = () => {
    // Guard clause: require valid item name
    if (!itemName.trim()) {
      return;
    }
    // Guard clause: require selected category
    if (!category) {
      return;
    }
    // Create item object with unique ID and current form values
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      quantity,
      category,
      image,
    };

    setItems((currentItems) => [...currentItems, newItem,]);
    setItemName("");
    setQuantity(1);
    setCategory("");
    setImage("");
  };
  //Remove item from the temporary `items` array by its unique ID.
  const handleRemoveItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };
  // Validates list requirements and trigger the onSave parent callback.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!listName.trim()) {
      return;
    }

    if (items.length === 0) {
      return;
    }
    // Assembling final ShoppingList object
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

            <textarea value={notes} onChange={(event) => setNotes(event.target.value)}
              placeholder="Add any notes about this shopping list..." rows={3} />
          </div>

          <div className={styles.itemSection}>
            <h3>Add Items</h3>
            <div className={styles.itemForm}>
              <div className={styles.formGroup}>
                <label htmlFor="itemName">Item Name </label>
                <input type="text" value={itemName} onChange={(event) => setItemName(event.target.value)}
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
                  <option value="Clothes">Clothes</option>
                  <option value="Tools">Tools</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.imageSection}>
                <label htmlFor="imageSearch">Choose an Image</label>

                <div className={styles.imageSearch}>
                  <input id="imageSearch" type="search" value={imageSearch} onChange={(event) =>
                    setImageSearch(event.target.value)} placeholder="Search for an item image..." />

                  <button type="button" onClick={handleSearchImages} disabled={isSearchingImages}>
                    {isSearchingImages ? "Searching..." : "Search"} </button>
                </div>

                {imageSearchError && (<p className={styles.imageError} role="alert">{imageSearchError}</p>)}

                {pixabayImages.length > 0 && (
                  <div className={styles.imageResults}>
                    {pixabayImages.map((pixabayImage) => (
                      <button key={pixabayImage.id} type="button" className={image === pixabayImage.webformatURL
                        ? styles.selectedImage : styles.imageOption} onClick={() =>
                          setImage(pixabayImage.webformatURL)} aria-label={`Select image of ${pixabayImage.tags}`}>
                        <img src={pixabayImage.previewURL} alt={pixabayImage.tags} /></button>
                    ))}
                  </div>
                )}

                {image && (
                  <div className={styles.selectedImagePreview}>
                    <p>Selected image:</p>
                    <img src={image} alt={`Selected image for ${itemName || "shopping item"}`} />
                  </div>
                )}
              </div>
            </div>

            <br/><button type="button" className={styles.addItemButton} onClick={handleAddItem}> + Add Item </button>
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