import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check sessionStorage and validate with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUserId = sessionStorage.getItem("userId");

      if (storedUserId) {
        try {
          // Validate user exists in backend (db.json)
          const freshUser = await authService.getUserById(storedUserId);
          setUser(freshUser);
          setIsLoggedIn(true);
        } catch (error) {
          // User not found in backend, clear session
          console.error("User not found in backend:", error);
          sessionStorage.removeItem("userId");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login - validates against backend, stores only userId in session
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Store only userId - actual data fetched from backend
    sessionStorage.setItem("userId", userData.id);
  };

  // Logout - clears session
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("userId");
  };

  // Update user data
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    if (user?.id) {
      try {
        const freshUser = await authService.getUserById(user.id);
        setUser(freshUser);
        return freshUser;
      } catch (error) {
        console.error("Failed to refresh user:", error);
        logout();
        return null;
      }
    }
    return null;
  };

  // Get user initials (e.g., "JD" for John Doe)
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
    getInitials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
