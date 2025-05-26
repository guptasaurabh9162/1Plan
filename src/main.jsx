import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LogInContextProvider } from "./Context/LogInContext/Login.jsx";
import ErrorBoundary from "./components/constants/Error.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

// Single createRoot call
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="202473251048-cm4a153faphm7fsp8kkvpprdi127uchu.apps.googleusercontent.com">
      <Auth0Provider
        domain={import.meta.env.VITE_DOMAIN_NAME}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <LogInContextProvider>
          <ErrorBoundary>
            <Toaster />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorBoundary>
        </LogInContextProvider>
      </Auth0Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
