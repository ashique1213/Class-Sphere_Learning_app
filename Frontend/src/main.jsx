import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store.js";
import "./index.css";

const GOOGLE_CLIENT_ID = "46026572444-qtcre16p8h1vdbs9a3drsr6qjr96om4i.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root")); 

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </GoogleOAuthProvider>
);
