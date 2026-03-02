import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) throw new Error("User not found");
      const userData = await response.json();
      const { password, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
    } catch {
      localStorage.removeItem("adminUserId");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("adminUserId");
    if (storedUserId) {
      fetchUser(storedUserId).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    localStorage.setItem("adminUserId", userData.id);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUserId");
  };

  const isLoggedIn = !!user;
  const isSuperAdmin = user?.role === "super-admin";
  const isAdmin = user?.role === "admin" || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        isSuperAdmin,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
