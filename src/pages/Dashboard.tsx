import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTournaments } from '@/contexts/TournamentContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { FaUser, FaUsers, FaPhone, FaMapMarkerAlt, FaEnvelope, FaTrophy, FaCalendarAlt, FaClock } from 'react-icons/fa'

const Dashboard = () => {
  const { user, isLoggedIn, getEnrolledTournaments } = useAuth()
  const { getTournament, getTournamentsByUser } = useTournaments()

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-pink-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar esta página.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">Fazer Login</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/cadastrar">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-light">
      {/* Header */}
      <NavigationHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vinda, {user.responsibleName}! 🏆
          </h1>
          <p className="text-gray-600">
            Gerencie as inscrições do time <strong>{user.teamName}</strong> e acompanhe os próximos torneios da Copa PAB.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Team Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUsers className="text-hot-pink" />
              Informações do Time
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaUsers className="text-hot-pink w-5" />
                <div>
                  <span className="font-medium text-gray-700">Nome do Time:</span>
                  <div className="text-gray-600">{user.teamName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaUser className="text-hot-pink w-5" />
                <div>
                  <span className="font-medium text-gray-700">Responsável:</span>
                  <div className="text-gray-600">{user.responsibleName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-hot-pink w-5" />
                <div>
                  <span className="font-medium text-gray-700">E-mail:</span>
                  <div className="text-gray-600">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-hot-pink w-5" />
                <div>
                  <span className="font-medium text-gray-700">Telefone:</span>
                  <div className="text-gray-600">{user.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-hot-pink w-5" />
                <div>
                  <span className="font-medium text-gray-700">Cidade:</span>
                  <div className="text-gray-600">{user.city}</div>
                </div>
              </div>
            </div>
              <Button variant="outline" className="w-full mt-6" asChild>
              <Link to="/profile">Editar Informações</Link>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaTrophy className="text-hot-pink" />
              Ações Rápidas
            </h2>
            
            <div className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/torneios" className="flex items-center gap-3">
                  <FaCalendarAlt />
                  Ver Próximos Torneios
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/jogadoras" className="flex items-center gap-3">
                  <FaUsers />
                  Gerenciar Jogadoras
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/minhas-inscricoes" className="flex items-center gap-3">
                  <FaTrophy />
                  Minhas Inscrições
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/historico" className="flex items-center gap-3">
                  <FaCalendarAlt />
                  Histórico de Participações
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="default">
                <Link to="/torneios" className="flex items-center gap-3">
                  <FaCalendarAlt />
                  Buscar Novo Torneio
                </Link>
              </Button>
            </div>
          </div>
        </div>        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Atividade Recente
          </h2>
          
          {user.role === 'admin' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Torneios Criados</h3>
              {getTournamentsByUser(user.id).length > 0 ? (
                <div className="space-y-3">
                  {getTournamentsByUser(user.id).slice(0, 3).map(tournament => (
                    <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{tournament.title}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {new Date(tournament.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tournament.status === 'published' ? 'bg-green-100 text-green-800' :
                        tournament.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tournament.status === 'published' ? 'Publicado' :
                         tournament.status === 'completed' ? 'Finalizado' : 'Rascunho'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaTrophy className="mx-auto text-4xl mb-4 opacity-50" />
                  <p>Nenhum torneio criado ainda.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Inscrições em Torneios</h3>
              {getEnrolledTournaments().length > 0 ? (
                <div className="space-y-3">
                  {getEnrolledTournaments().slice(0, 3).map(tournamentId => {
                    const tournament = getTournament(tournamentId)
                    if (!tournament) return null
                    return (
                      <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{tournament.title}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {new Date(tournament.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          new Date(tournament.date) > new Date() ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {new Date(tournament.date) > new Date() ? 'Próximo' : 'Finalizado'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaTrophy className="mx-auto text-4xl mb-4 opacity-50" />
                  <p>Ainda não há inscrições registradas.</p>
                  <p className="text-sm mt-2">
                    Quando você se inscrever em torneios, eles aparecerão aqui.
                  </p>
                  <Button asChild className="mt-4" variant="default">
                    <Link to="/torneios">
                      Explorar Torneios
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Histórico de Participações */}
        {user.role !== 'admin' && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaClock className="text-hot-pink" />
              Histórico de Participações
            </h2>
            
            {getEnrolledTournaments().filter(tournamentId => {
              const tournament = getTournament(tournamentId)
              return tournament && new Date(tournament.date) < new Date()
            }).length > 0 ? (
              <div className="space-y-3">
                {getEnrolledTournaments()
                  .map(tournamentId => getTournament(tournamentId))
                  .filter(tournament => tournament && new Date(tournament.date) < new Date())
                  .slice(0, 5)
                  .map(tournament => (
                    <div key={tournament!.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{tournament!.title}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          {tournament!.location}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          {new Date(tournament!.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/torneio/${tournament!.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaClock className="mx-auto text-4xl mb-4 opacity-50" />
                <p>Nenhuma participação anterior encontrada.</p>
                <p className="text-sm mt-2">
                  Seus torneios finalizados aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Dashboard