import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { LuShoppingCart } from "react-icons/lu";

export const Navbar = () => {
  // Hook navigation 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // Retrieve current user object from global auth state slice
  const user = useSelector((state: RootState) => state.auth.user);
  // Log out user by dispatching the logout action to clear Redux state
  const handleLogout = () => {dispatch(logout());
     navigate("/");};

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}> <LuShoppingCart />  My Shopping's</div>

      <nav className={styles.nav}>
        {user && (
          <NavLink className={styles.user} to="/profile" >{user.name.substring(0, 1)}{user.surname.substring(0, 1)}</NavLink>
        )}
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>Logout</button>

      </nav>
    </header>
  );
};