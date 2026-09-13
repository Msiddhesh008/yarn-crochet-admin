import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyPaletteToDom } from './data/palette'
import './styles.css'

applyPaletteToDom()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
