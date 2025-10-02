
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const initialData = window.__INITIAL_DATA__ || {};
console.log('Hydratation côté client, initialPlaces:', initialData.initialPlaces);

const rootElement = document.getElementById('root');
console.log('DEBUG: rootElement innerHTML before hydration/render:', rootElement.innerHTML);
if (rootElement.hasChildNodes()) {
   console.log('Hydrating with SSR content:', rootElement.innerHTML);
  // Hydrate if server-rendered HTML exists
  hydrateRoot(rootElement, (
    <BrowserRouter>
      <App
        initialUser={initialData.initialUser}
        initialPlaces={initialData.initialPlaces}
        initialBookings={initialData.initialBookings || []}
        initialPerks={initialData.initialPerks || []}
        paginationData={initialData.paginationData}
      />
    </BrowserRouter>
  ));
} else {
  console.log('No SSR content, rendering client-side');
  // Fallback to client-side render if no server HTML
  const root = createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <App
        initialUser={initialData.initialUser}
        initialPlaces={initialData.initialPlaces}
        initialBookings={initialData.initialBookings || []}
        initialPerks={initialData.initialPerks || []}
        paginationData={initialData.paginationData}
      />
    </BrowserRouter>
  );
}