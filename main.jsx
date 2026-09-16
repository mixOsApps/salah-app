import React from "react";
import ReactDOM from "react-dom/client";
import SalahApp from "./salah-app";
import { registerServiceWorker } from "./src/registerServiceWorker";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SalahApp />
  </React.StrictMode>
);

registerServiceWorker();
