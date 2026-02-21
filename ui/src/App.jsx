import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LenisProvider } from "@/context/LenisProvider";
import AppRoutes from "@/routes/AppRoutes";
import store from "@/store/store";
import ScrollToTop from "@/components/shared/ScrollToTop";
import AuthModal from "@/components/auth/AuthModal";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <LenisProvider>
          <ScrollToTop />
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
              <AuthModalProvider>
                <AppRoutes />
                <AuthModal />
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
                  theme="light"
                  toastClassName={() =>
                    "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
                  }
                  bodyClassName={() => "text-sm font-white font-med block p-3"}
                  style={{ width: "auto", minWidth: "300px" }}
                />
              </AuthModalProvider>
            </AuthProvider>
          </ThemeProvider>
        </LenisProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
