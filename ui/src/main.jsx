import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./assets/styles/global.css";
import "./locales/i18n";

createRoot(document.getElementById("root")).render(<App />);
