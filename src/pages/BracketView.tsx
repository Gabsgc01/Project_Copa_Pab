import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTournaments } from '@/contexts/TournamentContext'
import { useAuth } from '@/contexts/AuthContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import MatchResult from '@/components/MatchResult'
import { BracketGenerator, type Bracket } from '@/utils/bracketGenerator'
import { FaArrowLeft, FaTrophy, FaCalendarAlt } from 'react-icons/fa'

const BracketView = () => {
  const { id } = useParams()
  const { getTournament } = useTournaments()
  const { isAdmin } = useAuth()
  const [bracket, setBracket] = useState<Bracket | null>(null)
  
  const tournament = getTournament(id || '')

  useEffect(() => {
    if (tournament) {
      // Se existe um bracket, carregá-lo, senão criar um novo
      if (tournament.status === 'completed' || tournament.status === 'published') {
        // Para demonstração, criar um bracket com alguns resultados
        const sampleTeams = Array.from({ length: 8 }, (_, i) => ({
          id: `team_${i + 1}`,
          name: `Time ${i + 1}`,
          coach: `Técnica ${i + 1}`,
          registrationDate: new Date().toISOString()
        }))
        
        const generatedBracket = BracketGenerator.generateBracket(sampleTeams, tournament.id)
        setBracket(generatedBracket)
      }
    }
  }, [tournament])

  const handleUpdateMatchResult = (matchId: string, goalsTeamA: number, goalsTeamB: number) => {
    if (!bracket) return

    try {
      const updatedBracket = BracketGenerator.updateMatchWithScore(bracket, matchId, goalsTeamA, goalsTeamB)
      setBracket(updatedBracket)
    } catch (error) {
      alert(`Erro ao atualizar resultado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Torneio não encontrado</h1>
          <p className="text-gray-600 mb-8">O torneio que você está procurando não existe.</p>
          <Button asChild>
            <Link to="/torneios">Voltar aos Torneios</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!bracket) {
    return (
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Chaveamento não disponível</h1>
          <p className="text-gray-600 mb-8">O chaveamento deste torneio ainda não foi gerado.</p>
          <Button asChild>
            <Link to={`/torneio/${tournament.id}`}>Ver Detalhes do Torneio</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  // Organizar partidas por rodada
  const rounds = bracket.matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = []
    }
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, typeof bracket.matches>)

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to={`/torneio/${tournament.id}`} className="flex items-center gap-2">
              <FaArrowLeft />
              Voltar
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{tournament.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <FaCalendarAlt />
                <span>{new Date(tournament.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                bracket.status === 'finished' ? 'bg-green-100 text-green-800' :
                bracket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {bracket.status === 'finished' ? 'Finalizado' :
                 bracket.status === 'in_progress' ? 'Em andamento' :
                 'Preparado'}
              </span>
            </div>
          </div>
        </div>

        {/* Champion */}
        {bracket.status === 'finished' && bracket.matches.some(m => m.round === bracket.rounds && m.winner) && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-3 text-white">
              <FaTrophy className="text-3xl" />
              <div>
                <h2 className="text-2xl font-bold">CAMPEÃ</h2>
                <p className="text-xl">
                  {bracket.matches.find(m => m.round === bracket.rounds)?.winner?.name}
                </p>
              </div>
              <FaTrophy className="text-3xl" />
            </div>
          </div>
        )}

        {/* Bracket */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chaveamento</h2>
          
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-max pb-4">
              {Object.entries(rounds)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([roundNum, matches]) => (
                <div key={roundNum} className="flex-shrink-0">
                  <h3 className="text-center font-bold text-gray-700 mb-6 text-lg">
                    {BracketGenerator.getRoundName(parseInt(roundNum), bracket.rounds)}
                  </h3>
                  <div className="space-y-6 min-w-[280px]">
                    {matches.map(match => (
                      <MatchResult
                        key={match.id}
                        match={match}
                        onUpdateResult={handleUpdateMatchResult}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Informações do Torneio</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Local:</strong> {tournament.location}
            </div>
            <div>
              <strong>Premiação:</strong> {tournament.prize}
            </div>
            <div>
              <strong>Times:</strong> {bracket.teams.length}
            </div>
            <div>
              <strong>Rodadas:</strong> {bracket.rounds}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BracketView
