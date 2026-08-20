import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./Home.module.css";

export const Home = () => {
  return (
    <div className={styles.home}>
      <Navbar />

      <main className={styles.content}>
        <h1>My Shopping</h1>
        <p>Manage your shopping lists and keep track of the items you need.</p>
      </main>
    </div>
  );
};