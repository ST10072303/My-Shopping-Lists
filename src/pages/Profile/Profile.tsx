import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./Profile.module.css";

export const Profile = () => {
  return (
    <div className={styles.profile}>
      <Navbar /><br /><br />

      <main className={styles.content}>
        <h1>Profile</h1>

        <p>View and manage your profile information.</p>
      </main>
    </div>
  );
};