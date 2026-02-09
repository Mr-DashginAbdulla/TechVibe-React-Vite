import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import i18n from "@/locales/i18n";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUserId = localStorage.getItem("auth_token");

      if (storedUserId) {
        try {
          const response = await fetch(
            `http://localhost:3000/users/${storedUserId}`,
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.warn("User not found via token");
            logout();
          }
        } catch (error) {
          console.error("Session check failed:", error);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("auth_token", userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    toast.info(i18n.t("messages.logoutSuccess"));
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    updateUser,
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
