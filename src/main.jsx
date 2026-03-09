import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Clean up old WebAuthn/Face ID keys
try { localStorage.removeItem('tlc-webauthn-cred'); localStorage.removeItem('tlc-unlock-ts'); } catch (e) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
