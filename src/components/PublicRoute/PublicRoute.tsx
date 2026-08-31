import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

// PublicRoute component that guards guest-only routes 
export const PublicRoute = () => {
  // Read boolean authentication status from global Redux auth state
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    // Guard clause: If user is already logged in, redirect them away from public pages to "/home"
    return <Navigate to="/home" replace />;
  }
// If user is not authenticated, render nested child routes
  return <Outlet />;
};