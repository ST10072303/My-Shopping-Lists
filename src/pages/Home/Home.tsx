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

export const Home = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") ?? "";
  const sortKeyword = searchParams.get("sort") ?? "";
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const shoppingLists = useSelector((state: RootState) => state.shoppingLists.lists);
  const loading = useSelector((state: RootState) => state.shoppingLists.loading);
  const error = useSelector((state: RootState) => state.shoppingLists.error);
  //search feature
  const filteredShoppingLists =
  shoppingLists
    .map((list) => {
      let filteredItems = list.items;

      if (searchKeyword.trim()) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name
              .toLowerCase()
              .includes(
                searchKeyword.toLowerCase()
              )
        );
      }

      if (sortKeyword === "name") {
        filteredItems = [...filteredItems].sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );
      }

      if (sortKeyword === "category") {
        filteredItems = [...filteredItems].sort(
          (a, b) =>
            a.category.localeCompare(
              b.category
            )
        );
      }

      return {
        ...list,
        items: filteredItems,
      };
    })
    .filter(
      (list) => list.items.length > 0
    );
  //create function
  const handleSaveShoppingList = async (shoppingList: ShoppingList) => {
    if (!user) {
      return;
    }

    try {
      const listToSave: ShoppingList = { ...shoppingList, userId: user.id, };
      const savedList = await createShoppingList(listToSave);
      dispatch(addShoppingList(savedList));
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create shopping list:", error);

      dispatch(
        setError("Unable to create shopping list. Please try again.")
      );
    }
  };
  //updated function
  const handleUpdateShoppingList = async (shoppingList: ShoppingList) => {
    try {
      const editingList = await updateShoppingList(shoppingList);

      dispatch(updateShoppingListState(editingList));
      setEditingList(null);
    } catch (error) {
      console.error("Failed to update shopping list:", error);

      dispatch(
        setError("Unable to update shopping list. Please try again."));
    }
  };
  //delete function
  const handleDeleteShoppingList = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this shopping list?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteShoppingList(id);

      dispatch(
        deleteShoppingListState(id)
      );
    } catch (error) {
      console.error("Failed to delete shopping list:", error);

      dispatch(
        setError("Unable to delete shopping list. Please try again."));
    }
  };
  //Read function
  const loadShoppingLists = async () => {
    if (!user) {
      return;
    }
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const lists = await getShoppingLists(user.id);

      dispatch(setShoppingLists(lists));
    } catch (error) {
      console.error("Failed to load shopping lists:", error);

      dispatch(
        setError("Unable to load shopping lists. Please try again."));
      //make loading state to not get stuck
    } finally {
      dispatch(setLoading(false));
    }
  };
  //automatically load list data from server
  useEffect(() => {
    loadShoppingLists();
  }, [user]);

  return (
    <div className={styles.home}>
      <Navbar /> <br /><br /><br /><br />
      <main className={styles.content}>
        <section className={styles.header}>
          <div>
            <h1>My Shopping</h1>
            <p>Create and manage your shopping lists in one place.</p>
          </div>

          <button type="button" className={styles.addButton} onClick={() => setShowAddForm(true)}>+ Add Shopping List</button>
        </section>

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
            }} />
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
            <h2>Shopping Lists</h2>
            <span>{shoppingLists.length}{" "} {shoppingLists.length === 1 ? "list" : "lists"}</span>
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

                <div className={styles.items}>
                  {list.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemInfo}>
                        {item.image && (<img src={item.image} alt={item.name} className={styles.itemImage} />)}
                        <span>{item.name}</span>
                      </div>

                      <span>{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <button type="button" onClick={() => setEditingList(list)}>Edit</button>
                  <button type="button" onClick={() => handleDeleteShoppingList(list.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showAddForm && (
        <AddShoppingList onCancel={() => setShowAddForm(false)} onSave={handleSaveShoppingList} />)}

      {editingList && (
        <EditShoppingList shoppingList={editingList} onCancel={() => setEditingList(null)} onSave={handleUpdateShoppingList} />)}
    </div>
  );
};