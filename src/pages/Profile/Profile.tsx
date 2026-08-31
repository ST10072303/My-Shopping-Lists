import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import styles from "./Profile.module.css";
import {updateUserCredentials, updateUserProfile, } from "../../services/authService";
import { updateUser } from "../../store/authSlice";
import { NavLink } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock } from "lucide-react";

export const Profile = () => {
  // getting user object from Redux auth state slice
  const user = useSelector((state: RootState) => state.auth.user);
  // Getting Redux dispatch function to update global state
  const dispatch = useDispatch();

  if (!user) {
    return (
      <main className={styles.container}>
        <section className={styles.profileCard}>
          <h1>Profile</h1>
          <p>Unable to load your profile.</p>
        </section>
      </main>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [surname, setSurname] = useState(user.surname ?? "");
  const [cellNumber, setCellNumber] = useState(user.cellNumber ?? "");
  // Loading and error states for profile form submission
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  // State for toggling login credentials edit mode
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  // Loading and error states for credentials form submission
  const [credentialError, setCredentialError] = useState("");
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser form refresh 
    event.preventDefault();
    // Guard clause: ensure user object exists
    if (!user) {
      return;
    }
    setError("");
    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(user.id, {
        name: name.trim(),
        surname: surname.trim(),
        cellNumber: cellNumber.trim(),
      });
      // Update Redux state with new user details returned
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Unable to update your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
// Submit updated login credentials (email, password)
  const handleSaveCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setCredentialError("");
    setIsSavingCredentials(true);

    try {
      const updatedUser = await updateUserCredentials(user.id, {email: email.trim(),password});
      // Update Redux state with new user credentials 
      dispatch(updateUser(updatedUser));
      setPassword("");
      // hide edit details form
      setIsEditingCredentials(false);
    } catch (error) {
      console.error("Failed to update credentials:", error);

      if (error instanceof Error) {
        setCredentialError(error.message);
      } else {
        setCredentialError("Unable to update your login credentials.");
      }
    } finally {
      setIsSavingCredentials(false);
    }
  };

  return (
    <main className={styles.profileContainer}>
      <section className={styles.profileCard}>
        <NavLink to="/home" className={styles.backBtn}>
          <ArrowLeft size={20}/>
          <span>Back</span>
        </NavLink>

        <div className={styles.profileHeader}>
          <div className={styles.profileIcon}>
            <User size={40} />
          </div>

          <h1>My Profile</h1>
          <p>View and manage your account information.</p>
        </div>

        {/* View and edit Profile Information */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <h2>Personal Information</h2>
            <p>Manage your personal account details.</p>
          </div>

          <div className={styles.profileDetails}>
            {isEditing ? (
              <form className={styles.editForm} onSubmit={handleSaveProfile}>
                <div className={styles.formGroup}>
                  <label htmlFor="profileName">
                    <User size={17} />Name</label>

                  <input id="profileName" type="text" value={name} onChange={(event) =>
                      setName(event.target.value)}required/>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="profileSurname"><User size={17} />Surname</label>

                  <input id="profileSurname" type="text" value={surname} onChange={(event) =>
                      setSurname(event.target.value)}required/>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="profileCellNumber"><Phone size={17} />Cell Number</label>

                  <input id="profileCellNumber" type="tel" value={cellNumber}onChange={(event) =>
                      setCellNumber(event.target.value)}required/>
                </div>

                {error && (<p className={styles.error} role="alert">{error}</p>)}

                <div className={styles.actions}>
                  <button type="button" className={styles.cancelButton} onClick={() => {
                      setName(user.name); setSurname(user.surname); setCellNumber(user.cellNumber);
                      setError(""); setIsEditing(false); }}disabled={isSaving}>Cancel</button>
                      <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.detail}>
                  <div className={styles.detailIcon}>
                    <User size={18} />
                  </div>

                  <div>
                    <span className={styles.label}>Name</span>
                    <span className={styles.value}>{user.name}</span>
                  </div>
                </div>

                <div className={styles.detail}>
                  <div className={styles.detailIcon}><User size={18} />
                  </div>

                  <div>
                    <span className={styles.label}>Surname</span>
                    <span className={styles.value}>{user.surname}</span>
                  </div>
                </div>

                <div className={styles.detail}>
                  <div className={styles.detailIcon}>
                    <Mail size={18} />
                  </div>

                  <div>
                    <span className={styles.label}>Email Address</span>
                    <span className={styles.value}>{user.email}</span>
                  </div>
                </div>

                <div className={styles.detail}>
                  <div className={styles.detailIcon}>
                    <Phone size={18} />
                  </div>

                  <div>
                    <span className={styles.label}>Cell Number</span>
                    <span className={styles.value}>{user.cellNumber}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className={styles.actions}>
              <button type="button" onClick={() => {setName(user.name);
                  setSurname(user.surname); setCellNumber(user.cellNumber);
                  setError(""); setIsEditing(true); }}>Edit Profile</button>
            </div>
          )}
        </div>

        {/* Login Credentials */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div>
              <h2>Login Credentials</h2>
              <p>Update the email address or password used to log in.</p>
            </div>
          </div>

          {isEditingCredentials ? (
            <form className={styles.editForm} onSubmit={handleSaveCredentials}>
              <div className={styles.formGroup}>
                <label htmlFor="profileEmail"><Mail size={17} />Email Address</label>

                <input id="profileEmail" type="email" value={email} onChange={(event) =>
                    setEmail(event.target.value)}required/>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="profilePassword"><Lock size={17} />New Password</label>

                <input id="profilePassword" type="password" value={password} onChange={(event) =>
                    setPassword(event.target.value)} minLength={6} required />
              </div>

              {credentialError && (<p className={styles.error}role="alert">{credentialError}</p>)}

              <div className={styles.actions}>
                <button type="button" className={styles.cancelButton} disabled={isSavingCredentials}
                onClick={() => {setEmail(user.email); setPassword(""); setCredentialError("");
                setIsEditingCredentials(false);}}>Cancel</button>

                <button type="submit" disabled={isSavingCredentials}>
                  {isSavingCredentials ? "Saving..." : "Save Changes"} </button>

              </div>
            </form>
          ) : (
            <div className={styles.credentialsView}>
              <div className={styles.detail}>
                <div className={styles.detailIcon}>
                  <Mail size={18} />
                </div>

                <div>
                  <span className={styles.label}>Email Address</span>

                  <span className={styles.value}>
                    {user.email}
                  </span>
                </div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailIcon}>
                  <Lock size={18} />
                </div>

                <div>
                  <span className={styles.label}>Password</span>
                  <span className={styles.value}>•••••••</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button type="button" onClick={() => {setEmail(user.email);
                    setPassword(""); setCredentialError("");
                    setIsEditingCredentials(true);}}>Edit Login</button>
              </div>
            </div>
          )}
        </div>

      </section>
    </main>
  );
};