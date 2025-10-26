import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaArrowLeft } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { useTournaments } from '@/contexts/TournamentContext'
import { useAuth } from '@/contexts/AuthContext'
import { isTournamentFinished, formatDateBR } from '@/utils/timeUtils'

const Historico = () => {
  const { getTournament } = useTournaments()
  const { getEnrolledTournaments, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-pink-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para ver o histórico de participações.
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

  const enrolledIds = getEnrolledTournaments()
  const enrolledCompleted = enrolledIds
    .map(id => getTournament(id))
    .filter(t => isTournamentFinished(t)) as any[]

  const formatDate = (dateString: string) => formatDateBR(dateString)

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <FaArrowLeft />
            Voltar ao Dashboard
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Histórico de Participações</h1>
          <p className="text-gray-600">Torneios em que seu time participou e que já foram finalizados.</p>
        </div>

        {enrolledCompleted.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCompleted.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-hot-pink transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={tournament.imageUrl} alt={tournament.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold mb-1 text-gray-800 line-clamp-2">{tournament.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium flex items-center gap-1">
                      <FaTrophy />
                      Finalizado
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tournament.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaCalendarAlt className="text-hot-pink" />
                      <span>{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaMapMarkerAlt className="text-hot-pink" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/torneio/${tournament.id}`}>Ver Detalhes</Link>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <Link to={`/chaveamento/${tournament.id}`}>Ver Chaveamento</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏅</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Nenhuma participação finalizada encontrada</h3>
            <p className="text-gray-500 mb-6">Quando seu time participar de torneios e eles forem finalizados, eles aparecerão aqui.</p>
            <Button asChild>
              <Link to="/torneios">Ver Torneios</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Historico
