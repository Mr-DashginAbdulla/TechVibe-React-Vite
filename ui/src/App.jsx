import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LenisProvider } from "@/context/LenisProvider";
import AppRoutes from "@/routes/AppRoutes";
import store from "@/store/store";
import ScrollToTop from "@/components/shared/ScrollToTop";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <LenisProvider>
          <ScrollToTop />
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
              <AppRoutes />
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
                theme="light"
              />
            </AuthProvider>
          </ThemeProvider>
        </LenisProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
