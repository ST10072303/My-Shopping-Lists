import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ShoppingList } from "../../types/ShoppingItem";
import { getShoppingListById } from "../../services/shoppingListService";
import styles from "./SharingList.module.css";

export const SharingList = () => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {const loadShoppingList = async () => {
      if (!id) {
        setError("Shopping list could not be found.");
        setLoading(false);
        return;
      }

      try {
        const list = await getShoppingListById(id);
        setShoppingList(list);
      } catch (error) {
        console.error("Failed to load shared shopping list:",error);
        setError("Unable to load this shopping list.");
      } finally {
        setLoading(false);
      }
    };

    loadShoppingList();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.sharingContainer}>
        <p>Loading shopping list...</p>
      </main>
    );
  }

  if (error || !shoppingList) {
    return (
      <main className={styles.sharingContainer}>
        <section className={styles.sharingCard}>
          <h1>Shopping List</h1>
          <p>{error || "This shopping list could not be found."}</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.sharingContainer}>
      <section className={styles.sharingCard}>
        <div className={styles.shareHeader}>
          <p className={styles.sharedLabel}>Shared Shopping List</p>
          <h1>{shoppingList.name}</h1>

          {shoppingList.notes && (<p>{shoppingList.notes}</p>)}
        </div>

        <div className={styles.sharingItems}>
          {shoppingList.items.map((item) => (
            <div key={item.id} className={styles.shareItem}>
              {item.image && (
                <img src={item.image} alt={item.name} className={styles.shareItemImage}/>)}

              <div className={styles.itemInfo}>
                <h2>{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Category: {item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};