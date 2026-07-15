import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);