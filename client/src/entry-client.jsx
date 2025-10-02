
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';

// Récupérer les données injectées par le serveur dans le HTML
const initialData = window.__INITIAL_DATA__ || {};
const { initialUser = null, initialPlaces = [], env = {} } = initialData;

hydrateRoot(
  document.getElementById('root'),
  <HelmetProvider>
    <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider initialUser={initialUser}>
        <PlaceProvider initialPlaces={initialPlaces}>
          <BrowserRouter>
            <App initialUser={initialUser} initialPlaces={initialPlaces} />
          </BrowserRouter>
        </PlaceProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);
