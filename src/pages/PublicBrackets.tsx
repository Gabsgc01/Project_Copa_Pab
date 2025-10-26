import { useState, useEffect } from 'react'
import NavigationHeader from '@/components/NavigationHeader'
import BracketViewer from '@/components/BracketViewer'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { 
  FaTrophy, 
  FaCalendarAlt, 
  FaUsers, 
  FaArrowLeft,
  FaEye,
  FaClock
} from 'react-icons/fa'
import { formatDateBR } from '@/utils/timeUtils'

interface PublicTournament {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  bracket: any
  isPublic: boolean
  createdAt: string
}

const PublicBrackets = () => {
  const [tournaments, setTournaments] = useState<PublicTournament[]>([])
  const [viewingTournament, setViewingTournament] = useState<PublicTournament | null>(null)

  useEffect(() => {
    loadPublicTournaments()
  }, [])

  const loadPublicTournaments = () => {
    const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    const publicTournaments = allTournaments.filter((t: any) => t.isPublic && t.bracket)
    setTournaments(publicTournaments)
  }

  const formatDate = (dateString: string) => formatDateBR(dateString)

  if (viewingTournament) {
    return (
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setViewingTournament(null)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaArrowLeft />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{viewingTournament.name}</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-hot-pink" />
                <span>
                  <strong>Período:</strong> {formatDate(viewingTournament.startDate)} - {formatDate(viewingTournament.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-hot-pink" />
                <span>
                  <strong>Times:</strong> {viewingTournament.bracket.teams.length} participantes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaTrophy className="text-hot-pink" />
                <span>
                  <strong>Rodadas:</strong> {viewingTournament.bracket.rounds} eliminatórias
                </span>
              </div>
            </div>
            {viewingTournament.description && (
              <p className="text-gray-600 mt-3">{viewingTournament.description}</p>
            )}
          </div>

          <BracketViewer
            bracket={viewingTournament.bracket}
            editable={false}
          />
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-4">
            <FaTrophy className="text-hot-pink" />
            Chaveamentos dos Torneios
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe os chaveamentos dos torneios ativos da Copa PAB. 
            Veja os confrontos, resultados e o progresso das equipes participantes.
          </p>
        </div>

        {/* Lista de Torneios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
                {tournament.description && (
                  <p className="text-gray-600 text-sm mb-3">{tournament.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-hot-pink" />
                    <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-hot-pink" />
                    <span>{tournament.bracket.teams.length} times participantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTrophy className="text-hot-pink" />
                    <span>{tournament.bracket.rounds} rodadas eliminatórias</span>
                  </div>
                </div>
              </div>

              {/* Status do Torneio */}
              <div className="mb-4">
                {new Date(tournament.endDate) < new Date() ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <FaClock className="mr-1" />
                    Finalizado
                  </span>
                ) : new Date(tournament.startDate) <= new Date() ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaTrophy className="mr-1" />
                    Em Andamento
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaCalendarAlt className="mr-1" />
                    Aguardando Início
                  </span>
                )}
              </div>

              <Button
                onClick={() => setViewingTournament(tournament)}
                className="w-full flex items-center justify-center gap-2"
              >
                <FaEye />
                Ver Chaveamento
              </Button>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <FaTrophy className="text-gray-400 text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Nenhum chaveamento disponível
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No momento não há torneios com chaveamentos públicos. 
              Fique atento às próximas competições da Copa PAB!
            </p>
          </div>
        )}

        {/* Informações */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📋 Chaveamentos Automáticos</h4>
              <p>
                Todos os chaveamentos são gerados automaticamente pelo sistema, 
                garantindo fairplay e transparência nas competições.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🏆 Acompanhamento em Tempo Real</h4>
              <p>
                Resultados são atualizados conforme as partidas acontecem, 
                permitindo acompanhar o progresso dos times favoritos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">👥 Times Participantes</h4>
              <p>
                Visualize todos os times participantes, seus técnicos e 
                o histórico de confrontos durante o torneio.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 Sistema de Eliminação</h4>
              <p>
                Formato de eliminação simples garante que apenas os melhores 
                times avancem para as próximas fases da competição.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PublicBrackets