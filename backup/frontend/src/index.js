import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';

// Añadir esta línea para resolver el problema de process
window.process = { env: { NODE_ENV: 'production' } };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);