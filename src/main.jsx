import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/theme.css";
import "./styles/global.css";
import App from "./App.jsx";
import { DriveAuthProvider } from "./context/DriveAuthContext.jsx";
import { getDriveMode } from "./lib/driveConfig.js";

try {
  const d = localStorage.getItem("rcp_dark");
  document.documentElement.setAttribute("data-theme", d !== "false" ? "dark" : "light");
} catch {
  document.documentElement.setAttribute("data-theme", "light");
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Root() {
  const mode = getDriveMode();
  if (clientId && (mode === "oauth" || mode === "oauth_incomplete")) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <DriveAuthProvider>
          <App />
        </DriveAuthProvider>
      </GoogleOAuthProvider>
    );
  }
  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
