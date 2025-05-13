import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "leaflet/dist/leaflet.css";
import './utils/leaflet-icons';

// Añadir esta línea para resolver el problema de process
window.process = { env: { NODE_ENV: 'production' } };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);