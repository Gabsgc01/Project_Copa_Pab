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
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

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
        name: user.teamName || user.name || 'Time',
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

  const handleUpdateStats = async () => {
    setIsUpdating(true)
    setUpdateMessage('')
    
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Recarregar os dados
      loadStats()
      loadRecentActivity()
      
      // Mostrar mensagem de sucesso
      setUpdateMessage('✅ Estatísticas atualizadas com sucesso!')
      
      // Remover mensagem após 3 segundos
      setTimeout(() => {
        setUpdateMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error)
      setUpdateMessage('❌ Erro ao atualizar estatísticas')
      
      setTimeout(() => {
        setUpdateMessage('')
      }, 3000)
    } finally {
      setIsUpdating(false)
    }
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

      {/* Botão para Recarregar Dados */}
      <div className="text-center">
        <button
          onClick={handleUpdateStats}
          disabled={isUpdating}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isUpdating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-hot-pink hover:bg-pink-600'
          } text-white`}
        >
          {isUpdating ? '🔄 Atualizando...' : '🔄 Atualizar Estatísticas'}
        </button>
        
        {updateMessage && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 text-sm font-medium">{updateMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardStatsCard