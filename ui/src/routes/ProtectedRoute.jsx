import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Generic auth guard.
 * - If `isLoading` => show a simple spinner.
 * - If not logged in => redirect to /auth/login and preserve intended location.
 * - Otherwise => render nested routes via <Outlet/>.
 */
export default function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[40px] h-[40px] border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
