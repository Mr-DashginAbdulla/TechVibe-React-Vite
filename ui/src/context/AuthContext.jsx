import { createContext, useContext, useState, useEffect } from "react";
import { showToast } from "@/components/shared/StyledToast";
import i18n from "@/locales/i18n";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // If email is not verified, we might choose not to consider them "logged in" fully.
          // But our backend login blocks unverified. Here we'll just check.
          if (firebaseUser.providerData.some(p => p.providerId === 'password') && !firebaseUser.emailVerified) {
             console.warn("User email not verified in Firebase.");
          }

          const token = await firebaseUser.getIdToken();
          localStorage.setItem("auth_token", token);

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.warn("Backend user sync failed");
            // Optionally sign out from firebase if backend doesn't know them
            setUser(null);
          }
        } catch (error) {
          console.error("Session check failed:", error);
        }
      } else {
        setUser(null);
        localStorage.removeItem("auth_token");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("auth_token", userData.token);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem("auth_token");
    showToast.info(i18n.t("messages.logoutSuccess"));
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
