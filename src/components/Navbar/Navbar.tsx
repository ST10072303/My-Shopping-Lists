import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store/store";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleLogout = () => {
    dispatch(logout());

    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>🛒 My Shopping</div>

      <nav className={styles.nav}>
        <NavLink to="/home" className={({ isActive }) =>
            isActive ? styles.active : styles.link}>Home </NavLink>

        <NavLink to="/profile" className={({ isActive }) =>
            isActive ? styles.active : styles.link}>Profile</NavLink>

        <button type="button" className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </nav>

      {user && (
        <div className={styles.user}>Welcome, {user.name}</div>
      )}
    </header>
  );
};