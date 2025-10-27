import Home from '@/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import UpcomingTournaments from '@/pages/UpcomingTournaments'
import PreviousTournaments from '@/pages/PreviousTournaments'
import TournamentDetails from '@/pages/TournamentDetails'
import TournamentRegistration from '@/pages/TournamentRegistration'
import BracketView from '@/pages/BracketView'
import ManagePlayers from '@/pages/ManagePlayers'
import MinhasInscricoes from '@/pages/MinhasInscricoes'
import Historico from '@/pages/Historico'
import BracketDemo from '@/pages/BracketDemo'
import AdminLogin from '@/pages/AdminLogin'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminUsers from '@/pages/AdminUsers'
import AdminTournaments from '@/pages/AdminTournaments'
import AdminBrackets from '@/pages/AdminBrackets'
import AdminSettings from '@/pages/AdminSettings'
import PublicBrackets from '@/pages/PublicBrackets'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: "/", 
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/cadastrar",
        element: <Register />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },    {
        path: "/torneios",
        element: <UpcomingTournaments />,
    },
    {
        path: "/torneios-anteriores",
        element: <PreviousTournaments />,
    },
    {
        path: "/torneio/:id",
        element: <TournamentDetails />,
    },
    {
        path: "/inscricao/:id",
        element: <TournamentRegistration />,
    },    {
        path: "/jogadoras",
        element: <ManagePlayers />,
    },
    {
        path: "/minhas-inscricoes",
        element: (
            <ProtectedRoute>
                <MinhasInscricoes />
            </ProtectedRoute>
        ),
    },    {
        path: "/historico",
        element: (
            <ProtectedRoute>
                <Historico />
            </ProtectedRoute>
        ),
    },
    {
        path: "/chaveamento",
        element: (
            <ProtectedRoute>
                <BracketDemo />
            </ProtectedRoute>
        ),
    },
    {
        path: "/chaveamento/:id",
        element: <BracketView />,
    },
    {
        path: "/chaveamentos",
        element: <PublicBrackets />,
    },
    // Rotas Administrativas
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/admin/dashboard",
        element: (
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <AdminRoute>
                <AdminUsers />
            </AdminRoute>
        ),
    },
    {
        path: "/admin/tournaments",
        element: (
            <AdminRoute>
                <AdminTournaments />
            </AdminRoute>
        ),
    },
    {
        path: "/admin/brackets",
        element: (
            <AdminRoute>
                <AdminBrackets />
            </AdminRoute>
        ),
    },
    {
        path: "/admin/settings",
        element: (
            <AdminRoute>
                <AdminSettings />
            </AdminRoute>
        ),
    }
])

export default router;