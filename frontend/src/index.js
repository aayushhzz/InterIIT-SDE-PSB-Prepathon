import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-8z3agy7sryyg0ev2.us.auth0.com"
    clientId="c7W2NfxmHAIqZCK9qmDHdSdIIwfpPIHD"
    authorizationParams={{
      redirect_uri: "http://localhost:3000/login/2fa"
    }}
  >
    <App />
  </Auth0Provider>,
);