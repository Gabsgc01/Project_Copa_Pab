import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { FaUsers, FaTrophy, FaCog, FaShieldAlt, FaFileAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import DashboardStatsCard from '@/components/DashboardStatsCard'
import { getSafeInitial, getSafeTeamName, getSafeResponsibleName, isValidUser, getSafeDate } from '@/utils/safeUtils'

const AdminDashboard = () => {
  const { user, getAllUsers } = useAuth()
  const allUsers = getAllUsers()

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Visualizar, editar e gerenciar todos os times cadastrados',
      icon: FaUsers,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Gerenciar Torneios',
      description: 'Criar, editar e controlar torneios e chaveamentos',
      icon: FaTrophy,
      href: '/admin/tournaments',
      color: 'bg-green-500'
    },
    {
      title: 'Chaveamentos',
      description: 'Criar e publicar chaveamentos para todos os usuários',
      icon: FaFileAlt,
      href: '/admin/brackets',
      color: 'bg-purple-500'
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema e backup de dados',
      icon: FaCog,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-hot-pink to-pink-light rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Copa PAB - Sistema de Gerenciamento</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Bem-vindo,</p>
              <p className="font-semibold text-gray-900">{user?.responsibleName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visão Geral</h2>
          <DashboardStatsCard />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Usuários Recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Times Cadastrados Recentemente</h2>
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {allUsers.length > 0 ? (
              <div className="space-y-4">
                {allUsers.slice(0, 5).filter(isValidUser).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-hot-pink to-pink-light rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {getSafeInitial(getSafeTeamName(user))}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{getSafeTeamName(user)}</h4>
                        <p className="text-sm text-gray-600">{getSafeResponsibleName(user)} • {user.city || 'Cidade não informada'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.players?.length || 0} jogadoras
                      </p>
                      <p className="text-xs text-gray-500">{getSafeDate(user.registrationDate || user.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUsers className="text-gray-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-600">Nenhum time cadastrado ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Navegação Rápida */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="text-center">
            <Button className="w-full">
              <FaUsers className="mr-2" />
              Gerenciar Usuários
            </Button>
          </Link>
          
          <Link to="/admin/tournaments" className="text-center">
            <Button className="w-full" variant="outline">
              <FaTrophy className="mr-2" />
              Gerenciar Torneios
            </Button>
          </Link>
          
          <Link to="/admin/brackets" className="text-center">
            <Button className="w-full" variant="outline">
              <FaFileAlt className="mr-2" />
              Chaveamentos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard