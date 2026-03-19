import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./assets/styles/global.css";
import "./locales/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </HelmetProvider>,
);
