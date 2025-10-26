import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTournaments } from '@/contexts/TournamentContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useState } from 'react'
import { 
  FaTrophy, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa'
import { isTournamentFinished, formatDateBR } from '@/utils/timeUtils'

const MinhasInscricoes = () => {
  const { user, isLoggedIn, getEnrolledTournaments, unenrollFromTournament } = useAuth()
  const { getTournament } = useTournaments()

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-pink-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar suas inscrições.
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

  const enrolledTournamentIds = getEnrolledTournaments()
  const enrolledTournaments = enrolledTournamentIds
    .map(id => getTournament(id))
    .filter(tournament => tournament !== undefined)

  // Separar torneios por status
  const upcomingTournaments = enrolledTournaments.filter(tournament => {
    const tournamentDate = new Date(tournament.date)
    const today = new Date()
    return tournamentDate > today && tournament.status !== 'completed'
  })

  const pastTournaments = enrolledTournaments.filter(tournament => isTournamentFinished(tournament))

  // Estado e helper para modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState<string | undefined>()
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {})

  const openConfirm = ({ title, message, onConfirm }: { title?: string; message: string; onConfirm: () => void }) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => () => {
      onConfirm()
      setConfirmOpen(false)
    })
    setConfirmOpen(true)
  }

  const handleUnenroll = (tournamentId: string, tournamentTitle: string) => {
    openConfirm({
      title: 'Cancelar Inscrição',
      message: `Tem certeza que deseja cancelar sua inscrição no torneio "${tournamentTitle}"?`,
      onConfirm: () => {
        unenrollFromTournament(tournamentId)
        alert('Inscrição cancelada com sucesso!')
      }
    })
  }

  const formatDate = (dateString: string) => formatDateBR(dateString)

  const isRegistrationExpired = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <FaArrowLeft />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaTrophy className="text-hot-pink text-3xl" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Minhas Inscrições
              </h1>
              <p className="text-gray-600">
                Gerencie suas inscrições nos torneios da Copa PAB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-100 rounded-full"></span>
              <span>Próximos: {upcomingTournaments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-100 rounded-full"></span>
              <span>Finalizados: {pastTournaments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
              <span>Total: {enrolledTournaments.length}</span>
            </div>
          </div>
        </div>

        {enrolledTournaments.length === 0 ? (
          // Estado vazio
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTrophy className="mx-auto text-6xl text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Você ainda não se inscreveu em nenhum torneio. 
              Explore os torneios disponíveis e faça sua primeira inscrição!
            </p>
            <div className="space-y-3">
              <Button asChild className="mr-4">
                <Link to="/torneios">Explorar Torneios</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Voltar ao Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Próximos Torneios */}
            {upcomingTournaments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaCalendarAlt className="text-green-600 text-xl" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Próximos Torneios ({upcomingTournaments.length})
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTournaments.map(tournament => {
                    const daysUntilTournament = getDaysUntil(tournament.date)
                    const daysUntilDeadline = getDaysUntil(tournament.registrationDeadline)
                    
                    return (
                      <div key={tournament.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {tournament.imageUrl && (
                          <div className="h-48 bg-gray-200 overflow-hidden">
                            <img 
                              src={tournament.imageUrl} 
                              alt={tournament.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                              {tournament.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              <FaCheckCircle className="text-green-500 text-sm" />
                              <span className="text-xs text-green-600 font-medium">Inscrito</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaCalendarAlt className="text-sm" />
                              <div className="flex-1">
                                <span className="text-sm">
                                  Data: {formatDate(tournament.date)}
                                </span>
                                {daysUntilTournament > 0 && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Em {daysUntilTournament} dias
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaMapMarkerAlt className="text-sm" />
                              <span className="text-sm">
                                {tournament.location}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaUsers className="text-sm" />
                              <div className="flex-1">
                                <span className="text-sm">
                                  {tournament.registeredTeams}/{tournament.maxTeams} times
                                </span>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-hot-pink h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FaClock className="text-sm text-orange-500" />
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">
                                  Inscrições até: {formatDate(tournament.registrationDeadline)}
                                </span>
                                {!isRegistrationExpired(tournament.registrationDeadline) && daysUntilDeadline > 0 && (
                                  <div className="text-xs text-orange-600 font-medium">
                                    {daysUntilDeadline} dias restantes
                                  </div>
                                )}
                                {isRegistrationExpired(tournament.registrationDeadline) && (
                                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                    <FaExclamationTriangle />
                                    Prazo encerrado
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Button asChild className="w-full" size="sm">
                              <Link to={`/torneio/${tournament.id}`}>
                                Ver Detalhes
                              </Link>
                            </Button>
                            
                            {!isRegistrationExpired(tournament.registrationDeadline) && (
                              <Button 
                                variant="outline" 
                                className="w-full text-red-600 border-red-300 hover:bg-red-50"
                                size="sm"
                                onClick={() => handleUnenroll(tournament.id, tournament.title)}
                              >
                                Cancelar Inscrição
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Torneios Finalizados */}
            {pastTournaments.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaClock className="text-blue-600 text-xl" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Torneios Finalizados ({pastTournaments.length})
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTournaments.map(tournament => (
                    <div key={tournament.id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-90">
                      {tournament.imageUrl && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img 
                            src={tournament.imageUrl} 
                            alt={tournament.title}
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-700 line-clamp-2">
                            {tournament.title}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                            Finalizado
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-sm" />
                            <span className="text-sm">
                              Data: {formatDate(tournament.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt className="text-sm" />
                            <span className="text-sm">
                              {tournament.location}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Button asChild className="w-full" variant="outline" size="sm">
                            <Link to={`/torneio/${tournament.id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                          
                          <Button asChild className="w-full" size="sm">
                            <Link to={`/chaveamento/${tournament.id}`}>
                              Ver Chaveamento
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-hot-pink to-pink-600 rounded-lg p-8 text-white text-center mt-8">
          <FaTrophy className="mx-auto text-4xl mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">
            Pronta para mais desafios?
          </h3>
          <p className="mb-6 opacity-90">
            Explore novos torneios e continue fazendo história na Copa PAB!
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/torneios">
              Descobrir Novos Torneios
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

export default MinhasInscricoes