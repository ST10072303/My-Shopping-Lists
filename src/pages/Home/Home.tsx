import { AddShoppingList } from "../../components/AddShoppingList/AddShoppingList";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch, } from "../../store/store";
import {
  addShoppingList, setError, setShoppingLists, setLoading,
  updateShoppingList as updateShoppingListState, deleteShoppingList as deleteShoppingListState,
} from "../../store/shoppingListSlice";
import { createShoppingList, getShoppingLists, updateShoppingList, deleteShoppingList } from "../../services/shoppingListService";
import type { ShoppingList } from "../../types/ShoppingItem";
import { EditShoppingList } from "../../components/EditItemModel/EditItemModel";
import { LuPencil, LuShare2, LuTrash2 } from "react-icons/lu";

export const Home = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  // React Router hook to synchronize search and sort state with the URL query string
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") ?? "";
  const sortKeyword = searchParams.get("sort") ?? "";
  // Track the specific ShoppingList object being edited in the modal
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  // Redux hooks setup
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const shoppingLists = useSelector((state: RootState) => state.shoppingLists.lists);
  const loading = useSelector((state: RootState) => state.shoppingLists.loading);
  const error = useSelector((state: RootState) => state.shoppingLists.error);
  //search and sort feature
  const filteredShoppingLists = shoppingLists.map((list) => {
    let filteredItems = list.items;
    // Filter items matching the search query string (case-insensitive)
    if (searchKeyword.trim()) {
      filteredItems = filteredItems.filter((item) => item.name.toLowerCase()
          .includes(searchKeyword.toLowerCase())
      );
    }
    // Sort items alphabetically by item name
    if (sortKeyword === "name") {
      filteredItems = [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortKeyword === "category") {
      filteredItems = [...filteredItems].sort((a, b) => a.category.localeCompare(b.category));
    }
    // Retur list with updated filtered/sorted items
    return { ...list, items: filteredItems, };
  })
    .filter(
      (list) => list.items.length > 0
    );
  //create a new shopping list function
  const handleSaveShoppingList = async (shoppingList: ShoppingList) => {
    if (!user) {
      return;
    }

    try {
      // Attach active user's ID to the new shopping list object
      const listToSave: ShoppingList = { ...shoppingList, userId: user.id, };
      // Save new list to backend database
      const savedList = await createShoppingList(listToSave);
      // Update global Redux store state
      dispatch(addShoppingList(savedList));
      // Hide the creation form on success
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create shopping list:", error);

      dispatch(
        setError("Unable to fetch shopping list from server. Please check your internet connectivity and try again.")
      );
    }
  };
  // Handles updating an existing shopping list.
  const handleUpdateShoppingList = async (shoppingList: ShoppingList) => {
    try {
      // Send updated list 
      const editingList = await updateShoppingList(shoppingList);
      // Dispatch updated list object to Redux store
      dispatch(updateShoppingListState(editingList));
      // Close the edit modal
      setEditingList(null);
    } catch (error) {
      console.error("Failed to update shopping list:", error);

      dispatch(
        setError("Unable to update shopping list. Please try again."));
    }
  };
  // handle delete a shoppinh list 
  const handleDeleteShoppingList = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this shopping list?");

    if (!confirmed) {
      return;
    }

    try {
      // Call to remove list record
      await deleteShoppingList(id);

      dispatch(
        // Remove item from global Redux store state
        deleteShoppingListState(id)
      );
    } catch (error) {
      console.error("Failed to delete shopping list:", error);

      dispatch(
        setError("Unable to delete shopping list. Please try again."));
    }
  };
  // Shares a shopping list link using the Web Share
  const handleShareShoppingList = async (list: ShoppingList) => {
    const shareUrl = `${window.location.origin}/share/${list.id}`;
    const shareData = { title: list.name, text: `Check out my shopping list: ${list.name}`, url: shareUrl, };

    try {
      // Use native browser share sheet if supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);

        window.alert("Shopping list link copied to clipboard.");
      }
    } catch (error) {
      console.error("Failed to share shopping list:", error);
    }
  };
  // Fetches the user's shopping lists from backend services and updates Redux state
  const loadShoppingLists = async () => {
    // Guard clause: exit if user object is not available yet
    if (!user) {
      return;
    }
    try {
      // Activate loading spinner indicator and reset existing errors
      dispatch(setLoading(true));
      dispatch(setError(null));
      // Fetch user's shopping lists
      const lists = await getShoppingLists(user.id);
      // Store returned list records in Redux state
      dispatch(setShoppingLists(lists));
    } catch (error) {
      console.error("Failed to load shopping lists:", error);

      dispatch(
        setError("Unable to load shopping lists. Please check your internet connection and try again."));
      //make loading state to not get stuck
    } finally {
      // Reset loading flag inside finally block to prevent UI state from getting stuck
      dispatch(setLoading(false));
    }
  };
  //automatically load list data from server
  useEffect(() => {
    loadShoppingLists();
  }, [user]);

  return (
    <div className={styles.home}>

      <main className={styles.content}>
        <Navbar /><br /><br />
        <section className={styles.header}>
          <h3>Create and manage all your shopping lists in one place.</h3>

          <button type="button" className={styles.addButton} onClick={() => setShowAddForm(true)}>+ Add New List</button>
        </section>

        {/*searching*/}
        <section className={styles.controls}>
          <div className={styles.searchContainer}>
            <label htmlFor="shoppingSearch">Search shopping items</label>
            <input id="shoppingSearch" type="search" value={searchKeyword} placeholder="Type to start searching..." onChange={(event) => {
              const value = event.target.value;
              if (value.trim()) {
                setSearchParams({ search: value, });
              } else {
                setSearchParams({});
              }
            }}/>
          </div>

          {/*sorting*/}
          <div className={styles.sortContainer}>
            <label htmlFor="shoppingSort">Sort by</label>
            <select id="shoppingSort" value={sortKeyword} onChange={(event) => {
              const value = event.target.value;
              const newParams = new URLSearchParams(searchParams);

              if (value) {
                newParams.set("sort", value);
              } else {
                newParams.delete("sort");
              }
              setSearchParams(newParams);
            }}>
              <option value="">Date Added</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        </section>

        {/*shopping lists section */}
        <section className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <h2>All Shopping Lists</h2>
           
          </div>

          <div className={styles.listGrid}>
            {loading && (<p>Loading shopping lists...</p>)}

            {!loading && error && (<p>{error}</p>)}

            {!loading && !error && searchKeyword && filteredShoppingLists.length === 0 && (
              <p>No shopping items found for "{searchKeyword}".</p>)}

            {!loading && !error && shoppingLists.length === 0 && (
              <p>You haven't created any shopping lists yet.</p>)}

            {!loading && !error && filteredShoppingLists.map((list) => (
              <article key={list.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{list.name}</h3>
                  <span> {list.items.length}{" "} {list.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {list.notes && (<p>{list.notes}</p>)}

                {/*list section */}
                <div className={styles.items}>{list.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemInfo}>
                        {item.image && (<img src={item.image} alt={item.name} className={styles.itemImage} />)}
                        <span style={{fontSize: "18px"}}>{item.name}</span>
                        <span style={{fontSize: "12px"}}>{item.category}</span>
                      </div>
                      <span>{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <button type="button" onClick={() => setEditingList(list)}><LuPencil style={{color: "#8672FF"}} /> Edit</button>
                  <button type="button" onClick={() => handleDeleteShoppingList(list.id)}><LuTrash2 style={{color: "#EF4444"}}/> Delete</button>
                  <button type="button" onClick={() => handleShareShoppingList(list)}><LuShare2 style={{color: "#3B82F6"}}/> Share</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      {showAddForm && (<AddShoppingList onCancel={() => setShowAddForm(false)} onSave={handleSaveShoppingList} />)}

      {editingList && (<EditShoppingList shoppingList={editingList} onCancel={() => setEditingList(null)} onSave={handleUpdateShoppingList} />)}
    </div>
  );
};