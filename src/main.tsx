import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouter'
import { AuthProvider } from './contexts/AuthContext'
import { TournamentProvider } from './contexts/TournamentContext'
import DataInitializer from './components/DataInitializer'
import './utils/dataManager' // Importa as funções globais de gerenciamento

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataInitializer />
    <AuthProvider>
      <TournamentProvider>
        <RouterProvider router={router} />
      </TournamentProvider>
    </AuthProvider>
  </StrictMode>,
)
