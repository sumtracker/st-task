import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { requestApiMiddleware } from "./middleware/api.middleware";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

requestApiMiddleware();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
