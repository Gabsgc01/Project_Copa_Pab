import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import BracketViewer from '@/components/BracketViewer'
import { BracketGenerator, type Bracket, type Team } from '@/utils/bracketGenerator'
import { 
  FaGlobe, 
  FaEyeSlash, 
  FaEye, 
  FaTrophy, 
  FaCalendarAlt, 
  FaUsers, 
  FaArrowLeft,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface PublicTournament {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  bracket: Bracket
  isPublic: boolean
  createdAt: string
}

const AdminBrackets = () => {
  const { isAdmin } = useAuth()
  const [publicTournaments, setPublicTournaments] = useState<PublicTournament[]>([])
  const [viewingBracket, setViewingBracket] = useState<PublicTournament | null>(null)

  useEffect(() => {
    loadPublicTournaments()
  }, [])

  const loadPublicTournaments = () => {
    // Carregar todos os torneios e filtrar aqueles que têm chaveamento
    const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    const tournamentsWithBrackets = allTournaments.filter((t: any) => t.bracket)
    setPublicTournaments(tournamentsWithBrackets)
  }

  const togglePublicStatus = (tournamentId: string) => {
    const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    const updatedTournaments = allTournaments.map((t: any) =>
      t.id === tournamentId ? { ...t, isPublic: !t.isPublic } : t
    )
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
    loadPublicTournaments()
  }

  const handleUpdateMatch = (tournamentId: string, matchId: string, winner: Team, score?: { teamA: number, teamB: number }) => {
    const tournament = publicTournaments.find(t => t.id === tournamentId)
    if (!tournament?.bracket) return
    
    try {
      const updatedBracket = BracketGenerator.updateMatchResult(tournament.bracket, matchId, winner, score)
      
      // Atualizar no localStorage
      const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
      const updatedTournaments = allTournaments.map((t: any) =>
        t.id === tournamentId ? { ...t, bracket: updatedBracket } : t
      )
      localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
      
      // Atualizar estado local
      setPublicTournaments(prev => prev.map(t =>
        t.id === tournamentId ? { ...t, bracket: updatedBracket } : t
      ))
      
      if (viewingBracket?.id === tournamentId) {
        setViewingBracket({ ...tournament, bracket: updatedBracket })
      }
    } catch (error) {
      alert(`Erro ao atualizar partida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const createDemoTournament = () => {
    const demoTeams: Team[] = [
      { id: 'team_1', name: 'Leoas do Norte', coach: 'Maria Silva', registrationDate: '2025-01-15' },
      { id: 'team_2', name: 'Águias Douradas', coach: 'Ana Santos', registrationDate: '2025-01-16' },
      { id: 'team_3', name: 'Panteras Rosa', coach: 'Carla Lima', registrationDate: '2025-01-17' },
      { id: 'team_4', name: 'Tigres United', coach: 'Juliana Costa', registrationDate: '2025-01-18' },
      { id: 'team_5', name: 'Estrelas FC', coach: 'Fernanda Oliveira', registrationDate: '2025-01-19' },
      { id: 'team_6', name: 'Flamingo FC', coach: 'Patricia Rocha', registrationDate: '2025-01-20' },
      { id: 'team_7', name: 'Amazonas FC', coach: 'Luciana Dias', registrationDate: '2025-01-21' },
      { id: 'team_8', name: 'Phoenix FC', coach: 'Roberta Mendes', registrationDate: '2025-01-22' },
    ]

    const bracket = BracketGenerator.generateBracket(demoTeams, 'demo_tournament')
    
    const demoTournament = {
      id: 'demo_tournament',
      name: 'Copa PAB 2025 - Demonstração',
      description: 'Torneio de demonstração com 8 times para mostrar o sistema de chaveamento',
      startDate: '2025-02-01',
      endDate: '2025-02-15',
      maxTeams: 8,
      registrationOpen: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      bracket,
      isPublic: true
    }

    const allTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
    const updatedTournaments = [...allTournaments, demoTournament]
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
    loadPublicTournaments()
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (viewingBracket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setViewingBracket(null)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaArrowLeft />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{viewingBracket.name}</h1>
            
            <div className="ml-auto flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                viewingBracket.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {viewingBracket.isPublic ? 'Público' : 'Privado'}
              </span>
              
              <Button
                onClick={() => {
                  togglePublicStatus(viewingBracket.id)
                  setViewingBracket(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null)
                }}
                variant={viewingBracket.isPublic ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {viewingBracket.isPublic ? <FaEyeSlash /> : <FaEye />}
                {viewingBracket.isPublic ? 'Tornar Privado' : 'Tornar Público'}
              </Button>
            </div>
          </div>

          <BracketViewer
            bracket={viewingBracket.bracket}
            onUpdateMatch={(matchId, winner, score) => handleUpdateMatch(viewingBracket.id, matchId, winner, score)}
            editable={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <FaArrowLeft />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Chaveamentos</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={createDemoTournament}
              className="flex items-center gap-2"
            >
              <FaPlus />
              Criar Torneio Demo
            </Button>
            <Link to="/admin/tournaments">
              <Button variant="outline">
                Gerenciar Torneios
              </Button>
            </Link>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <FaGlobe className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3 text-sm text-blue-700">
              <p className="font-medium">Controle de Visibilidade</p>
              <p className="mt-1">
                Aqui você pode controlar quais chaveamentos são visíveis publicamente. 
                Apenas chaveamentos marcados como <strong>Públicos</strong> aparecerão na área pública do site.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Chaveamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {publicTournaments.map((tournament) => (
            <div 
              key={tournament.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.isPublic ? 'Público' : 'Privado'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{tournament.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{tournament.startDate} - {tournament.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers />
                      <span>{tournament.bracket.teams.length} times</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTrophy />
                      <span>{tournament.bracket.rounds} rodadas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setViewingBracket(tournament)}
                  className="flex items-center gap-2"
                >
                  <FaEye />
                  Ver Chaveamento
                </Button>
                
                <Button
                  onClick={() => togglePublicStatus(tournament.id)}
                  variant={tournament.isPublic ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  {tournament.isPublic ? <FaEyeSlash /> : <FaGlobe />}
                  {tournament.isPublic ? 'Tornar Privado' : 'Tornar Público'}
                </Button>
              </div>

              {tournament.isPublic && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <FaGlobe className="flex-shrink-0 h-4 w-4 text-green-500" />
                    <div className="ml-2 text-sm text-green-700">
                      <p className="font-medium">Visível Publicamente</p>
                      <p>Este chaveamento pode ser visualizado por todos os usuários do site.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {publicTournaments.length === 0 && (
          <div className="text-center py-12">
            <FaTrophy className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum chaveamento criado</h3>
            <p className="text-gray-500 mb-6">
              Crie torneios e gere chaveamentos para gerenciar a visibilidade pública.
            </p>
            <div className="space-x-4">
              <Button onClick={createDemoTournament} className="flex items-center gap-2">
                <FaPlus />
                Criar Torneio Demo
              </Button>
              <Link to="/admin/tournaments">
                <Button variant="outline">
                  Gerenciar Torneios
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBrackets