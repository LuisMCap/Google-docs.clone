import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Router from "./Router.jsx";
import "./style/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
