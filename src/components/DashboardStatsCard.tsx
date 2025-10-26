import { useState, useEffect } from 'react'
import { FaUsers, FaTrophy, FaUserFriends, FaChartLine } from 'react-icons/fa'

interface DashboardStats {
  totalTeams: number
  totalPlayers: number
  totalTournaments: number
  activeTournaments: number
  completedTournaments: number
  lastUpdated: string
}

const DashboardStatsCard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    loadStats()
    loadRecentActivity()
  }, [])

  const loadStats = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    
    const totalPlayers = users.reduce((total: number, team: any) => 
      total + (team.players?.length || 0), 0
    )

    const currentStats: DashboardStats = {
      totalTeams: users.length,
      totalPlayers,
      totalTournaments: tournaments.length,
      activeTournaments: tournaments.filter((t: any) => t.status === 'published').length,
      completedTournaments: tournaments.filter((t: any) => t.status === 'completed').length,
      lastUpdated: new Date().toISOString()
    }

    setStats(currentStats)
    localStorage.setItem('dashboardStats', JSON.stringify(currentStats))
  }

  const loadRecentActivity = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    
    // Combinar e ordenar por data de criação
    const allItems = [
      ...users.map((user: any) => ({
        type: 'team',
        name: user.name,
        date: user.createdAt,
        icon: FaUsers
      })),
      ...tournaments.map((tournament: any) => ({
        type: 'tournament',
        name: tournament.title,
        date: tournament.createdAt,
        icon: FaTrophy
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    setRecentActivity(allItems.slice(0, 5))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!stats) return <div>Carregando estatísticas...</div>

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Times</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Jogadoras</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserFriends className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Torneios Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeTournaments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaTrophy className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Torneios Finalizados</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedTournaments}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaChartLine className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {recentActivity.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                <div className={`p-2 rounded-full ${
                  item.type === 'team' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  <Icon className={`text-sm ${
                    item.type === 'team' ? 'text-blue-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.type === 'team' ? 'Novo time cadastrado:' : 'Torneio criado:'} {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gradient-to-r from-hot-pink to-pink-light rounded-lg shadow-md p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">💡 Dica do Administrador</h3>
        <p className="text-sm opacity-90">
          Use as ferramentas do console para gerenciar dados de exemplo. Digite <code className="bg-white bg-opacity-20 px-2 py-1 rounded">window.showStats()</code> no console para ver estatísticas detalhadas.
        </p>
      </div>

      {/* Botão para Recarregar Dados */}
      <div className="text-center">
        <button
          onClick={() => {
            loadStats()
            loadRecentActivity()
          }}
          className="bg-hot-pink text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          🔄 Atualizar Estatísticas
        </button>
      </div>
    </div>
  )
}

export default DashboardStatsCard