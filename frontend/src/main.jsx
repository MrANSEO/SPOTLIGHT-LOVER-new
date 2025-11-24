import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import du Design System
import './styles/variables.css'
import './styles/animations.css'
import './styles/global.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
