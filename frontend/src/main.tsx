import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the service worker for offline support
if ('serviceWorker' in navigator) {
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');
    wb.register();
  });
}
