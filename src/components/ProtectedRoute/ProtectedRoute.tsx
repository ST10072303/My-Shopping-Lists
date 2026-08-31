import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

// ProtectedRoute component that guards private routes.
export const ProtectedRoute = () => {
  // Extract boolean authentication flag from global Redux auth state slice
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
// Guard clause: If user is not logged in, redirect them to the root route ("/")
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
// If user is authenticated, render nested child routes wrapped by this protected layout
  return <Outlet />;
};
