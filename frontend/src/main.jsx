import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { StorageProvider } from './context/StorageContext'
import { UserProvider } from './context/UserContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <StorageProvider>
          <App />
        </StorageProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
