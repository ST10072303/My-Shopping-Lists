import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import styles from "./Profile.module.css";
import { updateUserProfile } from "../../services/authService";
import { updateUser } from "../../store/authSlice";
import { NavLink } from "react-router-dom";

export const Profile = () => {
  //Redux 
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  //check if user exist
  if (!user) {
    return (
      <main className={styles.container}>
        <h1>Profile</h1>
        <p>Unable to load your profile.</p>
      </main>
    );
  }
  //form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [cellNumber, setCellNumber] = useState(user?.cellNumber ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  //save function
  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    setError("");
    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(user.id, {
        name: name.trim(),
        surname: surname.trim(), cellNumber: cellNumber.trim(),
      });

      dispatch(updateUser(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError("Unable to update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main className={styles.container}>


      <section className={styles.profileCard}>
        <nav className="styles.backBtn">
          <NavLink to="/home">Back </NavLink>
        </nav>

        <div className={styles.header}>
          <h1>My Profile</h1>
          <p>View and manage your account information.</p>
        </div>

        <div className={styles.profileDetails}>
          {isEditing ? (
            <form className={styles.editForm} onSubmit={handleSaveProfile}>
              <div className={styles.formGroup}>
                <label htmlFor="profileName">Name</label>

                <input id="profileName" type="text" value={name} onChange={(event) =>
                  setName(event.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="profileSurname">Surname</label>

                <input id="profileSurname" type="text" value={surname} onChange={(event) =>
                  setSurname(event.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="profileCellNumber">Cell Number</label>

                <input id="profileCellNumber" type="tel" value={cellNumber} onChange={(event) =>
                  setCellNumber(event.target.value)} required />
              </div>

              {error && (<p className={styles.error} role="alert">{error}</p>
              )}

              <div className={styles.actions}>
                <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>

                <button type="button" onClick={() => {
                  setName(user.name); setSurname(user.surname);
                  setCellNumber(user.cellNumber); setError(""); setIsEditing(false);
                }}
                  disabled={isSaving}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className={styles.detail}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{user.name}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Surname</span>
                <span className={styles.value}>{user.surname}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{user.email}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Cell Number</span>
                <span className={styles.value}>{user.cellNumber}</span>
              </div>
            </>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => {
            setName(user.name); setSurname(user.surname);
            setCellNumber(user.cellNumber); setError(""); setIsEditing(true);
          }}>Edit Profile</button>
        </div>
      </section>
    </main>
  );
};