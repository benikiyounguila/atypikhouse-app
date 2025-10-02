// client/entry-server.jsx
import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./providers/UserProvider";
import { PlaceProvider } from "./providers/PlaceProvider";

export async function render(url, initialData, res) {
  const helmetContext = {};

  const { initialUser = null, initialPlaces = [], env = {} } = initialData;

  const modules = new Set();
  const app = (
    <HelmetProvider context={helmetContext}>
      <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider initialUser={initialUser}>
          <PlaceProvider initialPlaces={initialPlaces}>
            <StaticRouter location={url}>
              <App
                initialUser={initialUser}
                initialPlaces={initialPlaces}
                initialBookings={initialData.initialBookings || []}
                initialPerks={initialData.initialPerks || []}
              />
            </StaticRouter>
          </PlaceProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
  console.log('DEBUG: initialData in entry-server:', initialData);
  const appHtml = renderToString(app);
  console.log('DEBUG: appHtml from renderToString:', appHtml ? appHtml.substring(0, 500) : 'null');

  return {
    appHtml,
    helmet: helmetContext.helmet,
    initialData,
    modules: Array.from(modules)
  };
}

