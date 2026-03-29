import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { NotificationProvider } from "@/context/NotificationContext";
import AppRoutes from "@/routes/AppRoutes";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

function ToastWrapper() {
  const { theme } = useTheme();
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolvedTheme}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CurrencyProvider>
          <ThemeProvider storageKey="admin-theme">
            <ErrorBoundary>
              <BrowserRouter>
                <AppRoutes />
                <ToastWrapper />
              </BrowserRouter>
            </ErrorBoundary>
          </ThemeProvider>
        </CurrencyProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
