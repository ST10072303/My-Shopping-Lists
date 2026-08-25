import styles from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { LuShoppingCart } from "react-icons/lu";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = () => {dispatch(logout()); navigate("/");};

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