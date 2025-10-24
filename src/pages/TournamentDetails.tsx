import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTournaments } from '@/contexts/TournamentContext'
import { useAuth } from '@/contexts/AuthContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy, FaInfoCircle, FaEnvelope, FaArrowLeft } from 'react-icons/fa'

const TournamentDetails = () => {
  const { id } = useParams()
  const { getTournament, enrollTeamInTournament, unenrollTeamFromTournament } = useTournaments()
  const { user, isLoggedIn, enrollInTournament, unenrollFromTournament, getEnrolledTournaments } = useAuth()
  
  const tournament = getTournament(id || '')
  const isEnrolled = getEnrolledTournaments().includes(id || '')

  if (!tournament) {
    return (
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Torneio não encontrado</h1>
          <p className="text-gray-600 mb-8">O torneio que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/torneios">Voltar aos Torneios</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }
  const handleEnrollment = () => {
    if (!tournament || !user) return
    
    if (isEnrolled) {
      unenrollFromTournament(tournament.id)
      unenrollTeamFromTournament(tournament.id, user.id)
    } else {
      const success = enrollTeamInTournament(tournament.id, user.id)
      if (success) {
        enrollInTournament(tournament.id)
      }
    }
  }

  const isRegistrationClosed = !tournament.isRegistrationOpen || 
    new Date() > new Date(tournament.registrationDeadline) ||
    tournament.registeredTeams >= tournament.maxTeams

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/torneios" className="flex items-center gap-2">
            <FaArrowLeft />
            Voltar aos Torneios
          </Link>
        </Button>

        {/* Tournament Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={tournament.imageUrl} 
              alt={tournament.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt />
                  <span>{new Date(tournament.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  <span>{tournament.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-hot-pink" />
                Descrição
              </h2>
              <p className="text-gray-600 leading-relaxed">{tournament.description}</p>
            </div>

            {/* Tournament Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações do Torneio</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Data do Torneio:</span>
                    <div className="text-gray-600">{new Date(tournament.date).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Local:</span>
                    <div className="text-gray-600">{tournament.location}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Prazo de Inscrição:</span>
                    <div className="text-gray-600">{new Date(tournament.registrationDeadline).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Vagas:</span>
                    <div className="text-gray-600">{tournament.registeredTeams}/{tournament.maxTeams} times</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Premiação:</span>
                    <div className="text-gray-600">{tournament.prize}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <div className={`inline-block px-2 py-1 rounded text-sm ${
                      tournament.isRegistrationOpen && !isRegistrationClosed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tournament.isRegistrationOpen && !isRegistrationClosed ? 'Inscrições Abertas' : 'Inscrições Fechadas'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Inscrição</h3>
              
              {!isLoggedIn ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-blue-800 text-sm mb-2">
                      Para se inscrever, você precisa ter uma conta.
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/cadastrar">Criar Conta</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">Já tenho conta</Link>
                  </Button>
                </div>
              ) : isRegistrationClosed ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-red-800 text-sm">
                      As inscrições para este torneio estão fechadas.
                    </p>
                  </div>
                  {tournament.status === 'completed' && (
                    <Button variant="outline" asChild className="w-full">
                      <Link to={`/chaveamento/${tournament.id}`}>Ver Chaveamento</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {isEnrolled ? (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <p className="text-green-800 text-sm font-medium">
                        ✓ Você está inscrito neste torneio!
                      </p>
                    </div>
                  ) : null}
                  
                  <Button 
                    onClick={handleEnrollment}
                    className="w-full"
                    variant={isEnrolled ? "outline" : "default"}
                  >
                    {isEnrolled ? "Cancelar Inscrição" : "Inscrever-se"}
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/chaveamento/${tournament.id}`}>Ver Chaveamento</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Dúvidas?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Entre em contato conosco para esclarecer qualquer dúvida sobre o torneio.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:contato@copa-pab.com" className="flex items-center gap-2 justify-center">
                  <FaEnvelope />
                  Entrar em Contato
                </a>
              </Button>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUsers className="text-hot-pink" />
                Vagas
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Times inscritos</span>
                  <span>{tournament.registeredTeams}/{tournament.maxTeams}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-hot-pink h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {tournament.maxTeams - tournament.registeredTeams} vagas restantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TournamentDetails
