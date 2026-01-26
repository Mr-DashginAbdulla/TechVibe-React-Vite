import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. BAŞLANĞIC: Səhifə yenilənəndə (Refresh) işə düşür
  useEffect(() => {
    const initAuth = async () => {
      // LocalStorage-dən yalnız ID-ni (Token kimi) oxuyuruq
      const storedUserId = localStorage.getItem("auth_token");

      if (storedUserId) {
        try {
          // Tokenə əsasən serverdən useri tapırıq
          const response = await fetch(
            `http://localhost:3000/users/${storedUserId}`,
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Useri RAM-a yazırıq
          } else {
            // User serverdə tapılmadısa (silinibbsə), təmizləyirik
            console.warn("User not found via token");
            logout();
          }
        } catch (error) {
          console.error("Session check failed:", error);
          // Server xətası olsa belə (internet yoxdursa), useri atmırıq,
          // amma burada təhlükəsizlik üçün logout edə bilərik.
        }
      }

      // Yoxlama bitdi, loading-i dayandırırıq
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 2. LOGIN funksiyası
  const login = (userData) => {
    setUser(userData); // Məlumatı RAM-a yazırıq
    localStorage.setItem("auth_token", userData.id); // Yalnız ID-ni saxlayırıq
  };

  // 3. LOGOUT funksiyası
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token"); // Tokeni silirik
    toast.info("Hesabdan çıxış edildi");
  };

  // 4. UPDATE funksiyası (Profil yenilənəndə)
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    // Token dəyişmir, çünki ID eynidir
  };

  // 5. Initials (Məsələn: "JD")
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const value = {
    user,
    isLoggedIn: !!user, // User varsa true, yoxsa false
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
