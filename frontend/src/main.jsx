import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { registerFirebaseMessagingServiceWorker } from './services/serviceWorker.js'

registerFirebaseMessagingServiceWorker().catch((error) => {
  console.error('[Koneko] Firebase service worker registration failed.', error)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
