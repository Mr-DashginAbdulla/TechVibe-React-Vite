import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LenisProvider } from "@/context/LenisProvider";
import AppRoutes from "@/routes/AppRoutes";
import store from "@/store/store";
import ScrollToTop from "@/components/shared/ScrollToTop";
import AuthModal from "@/components/auth/AuthModal";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

function ThemedToastContainer() {
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
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolvedTheme}
      toastClassName={() =>
        "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
      }
      bodyClassName={() => "text-sm font-white font-med block p-3"}
      style={{ width: "auto", minWidth: "300px" }}
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <LenisProvider>
            <ScrollToTop />
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <AuthProvider>
                <AuthModalProvider>
                  <AppRoutes />
                  <AuthModal />
                  <ThemedToastContainer />
                </AuthModalProvider>
              </AuthProvider>
            </ThemeProvider>
          </LenisProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
