import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { contractorConfig } from './config/contractor'
import App from './App'
import './styles.css'

// Push brand colors from the config into CSS variables; every shade in styles.css derives from these.
const root = document.documentElement
root.style.setProperty('--primary', contractorConfig.primaryColor)
root.style.setProperty('--accent', contractorConfig.accentColor)
document.title = `${contractorConfig.estimatorTitle} | ${contractorConfig.companyName}`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
