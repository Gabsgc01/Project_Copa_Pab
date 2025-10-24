import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaArrowLeft } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { useTournaments } from '@/contexts/TournamentContext'

const PreviousTournaments = () => {
  const { getCompletedTournaments } = useTournaments()
  
  const completedTournaments = getCompletedTournaments()

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/" className="flex items-center gap-2">
            <FaArrowLeft />
            Voltar ao Início
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Edições Anteriores
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Relembre os momentos especiais e as campeãs que fizeram história na Copa PAB. 
            Cada edição foi única e inesquecível!
          </p>
        </div>

        {/* Tournament Grid */}
        {completedTournaments.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {completedTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-hot-pink transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tournament.imageUrl} 
                    alt={tournament.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{tournament.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt />
                      <span>{new Date(tournament.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <FaTrophy />
                      Finalizado
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {tournament.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaMapMarkerAlt className="text-hot-pink" />
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaTrophy className="text-hot-pink" />
                      <span>{tournament.prize}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/torneio/${tournament.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                    <Button variant="default" className="flex-1" asChild>
                      <Link to={`/chaveamento/${tournament.id}`}>
                        Ver Chaveamento
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Nenhuma edição anterior encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              As edições finalizadas dos torneios aparecerão aqui.
            </p>
            <Button asChild>
              <Link to="/torneios">Ver Próximos Torneios</Link>
            </Button>
          </div>
        )}

        {/* Stats Section */}
        {completedTournaments.length > 0 && (
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Estatísticas das Edições
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-hot-pink/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-hot-pink mb-2">
                  {completedTournaments.length}
                </div>
                <div className="text-gray-600">Edições Realizadas</div>
              </div>
              <div className="bg-hot-pink/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-hot-pink mb-2">
                  {completedTournaments.reduce((acc, t) => acc + t.registeredTeams, 0)}
                </div>
                <div className="text-gray-600">Times Participaram</div>
              </div>
              <div className="bg-hot-pink/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-hot-pink mb-2">
                  {completedTournaments.reduce((acc, t) => acc + t.registeredTeams * 11, 0)}+
                </div>
                <div className="text-gray-600">Jogadoras Envolvidas</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default PreviousTournaments
