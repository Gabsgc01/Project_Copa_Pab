import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTournaments, type Tournament } from '@/contexts/TournamentContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BracketViewer from '@/components/BracketViewer'
import { BracketGenerator, type Bracket, type Team } from '@/utils/bracketGenerator'
import { 
  FaTrophy, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendarAlt, 
  FaUsers, 
  FaFlag, 
  FaArrowLeft,
  FaRandom,
  FaGlobe
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface AdminTournament extends Tournament {
  bracket?: Bracket
}

const AdminTournaments = () => {
  const { isAdmin } = useAuth()
  const { tournaments, addTournament, updateTournament, deleteTournament } = useTournaments()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showBracket, setShowBracket] = useState<AdminTournament | null>(null)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)

  // Formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    registrationDeadline: '',
    location: '',
    maxTeams: 16,
    registeredTeams: 0,
    prize: '',
    imageUrl: '',
    isRegistrationOpen: true
  })

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = () => {
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]') as Tournament[]
    setTournaments(storedTournaments)
  }

  const saveTournaments = (updatedTournaments: Tournament[]) => {
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
    setTournaments(updatedTournaments)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
      // Verificar se todas as informações estão completas
    const isComplete = !!(formData.name.trim() && 
                         formData.description.trim() && 
                         formData.startDate && 
                         formData.endDate && 
                         formData.maxTeams > 0)
      if (editingTournament) {
      // Editar torneio existente
      const updatedTournaments = tournaments.map(t =>
        t.id === editingTournament.id
          ? { 
              ...t, 
              ...formData, 
              status: (isComplete ? 'published' : 'draft') as Tournament['status'],
              isPublic: isComplete
            }
          : t
      )
      saveTournaments(updatedTournaments)
      setEditingTournament(null)
    } else {
      // Criar novo torneio
      const newTournament: Tournament = {
        id: `tournament_${Date.now()}`,
        ...formData,
        status: (isComplete ? 'published' : 'draft') as Tournament['status'],
        createdAt: new Date().toISOString(),
        isPublic: isComplete
      }
      saveTournaments([...tournaments, newTournament])
    }
    
    setShowCreateForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      maxTeams: 16,
      registrationOpen: true
    })
  }

  const deleteTournament = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este torneio? Esta ação não pode ser desfeita.')) {
      const updatedTournaments = tournaments.filter(t => t.id !== id)
      saveTournaments(updatedTournaments)
    }
  }

  const generateBracket = (tournament: Tournament) => {
    // Para demonstração, vamos criar times fictícios
    const sampleTeams: Team[] = Array.from({ length: Math.min(tournament.maxTeams, 8) }, (_, i) => ({
      id: `team_${i + 1}`,
      name: `Time ${i + 1}`,
      coach: `Técnica ${i + 1}`,
      registrationDate: new Date().toISOString().split('T')[0]
    }))

    const bracket = BracketGenerator.generateBracket(sampleTeams, tournament.id)
      const updatedTournaments = tournaments.map(t =>
      t.id === tournament.id
        ? { ...t, bracket, status: 'published' as const }
        : t
    )
    saveTournaments(updatedTournaments)
  }

  const togglePublic = (tournament: Tournament) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === tournament.id
        ? { ...t, isPublic: !t.isPublic }
        : t
    )
    saveTournaments(updatedTournaments)
  }

  const handleUpdateMatch = (tournamentId: string, matchId: string, winner: Team, score?: { teamA: number, teamB: number }) => {
    const tournament = tournaments.find(t => t.id === tournamentId)
    if (!tournament?.bracket) return
    
    try {
      const updatedBracket = BracketGenerator.updateMatchResult(tournament.bracket, matchId, winner, score)
      
      const updatedTournaments = tournaments.map(t =>
        t.id === tournamentId
          ? { ...t, bracket: updatedBracket }
          : t
      )
      saveTournaments(updatedTournaments)
      
      // Atualizar o estado local se estamos visualizando este torneio
      if (showBracket?.id === tournamentId) {
        setShowBracket({ ...tournament, bracket: updatedBracket })
      }
    } catch (error) {
      alert(`Erro ao atualizar partida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const startEdit = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setFormData({
      name: tournament.name,
      description: tournament.description,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      maxTeams: tournament.maxTeams,
      registrationOpen: tournament.registrationOpen
    })
    setShowCreateForm(true)
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

  if (showBracket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => setShowBracket(null)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaArrowLeft />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{showBracket.name} - Chaveamento</h1>
            
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={() => togglePublic(showBracket)}
                variant={showBracket.isPublic ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <FaGlobe />
                {showBracket.isPublic ? 'Público' : 'Privado'}
              </Button>
            </div>
          </div>

          {showBracket.bracket ? (
            <BracketViewer
              bracket={showBracket.bracket}
              onUpdateMatch={(matchId, winner, score) => handleUpdateMatch(showBracket.id, matchId, winner, score)}
              editable={true}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Chaveamento não gerado ainda.</p>
            </div>
          )}
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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Torneios</h1>
          </div>
          
          <Button 
            onClick={() => {
              setShowCreateForm(true)
              setEditingTournament(null)
              resetForm()
            }}
            className="flex items-center gap-2"
          >
            <FaPlus />
            Novo Torneio
          </Button>
        </div>

        {/* Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingTournament ? 'Editar Torneio' : 'Novo Torneio'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Torneio
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fim
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Times
                  </label>
                  <select
                    value={formData.maxTeams}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                  >
                    <option value={4}>4 times</option>
                    <option value={8}>8 times</option>
                    <option value={16}>16 times</option>
                    <option value={32}>32 times</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="registrationOpen"
                    checked={formData.registrationOpen}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationOpen: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="registrationOpen" className="text-sm text-gray-700">
                    Inscrições abertas
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTournament ? 'Salvar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingTournament(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Torneios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tournament.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tournament.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{tournament.startDate} - {tournament.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers />
                      <span>Até {tournament.maxTeams} times</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFlag />                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tournament.status === 'published' ? 'bg-green-100 text-green-800' :
                        tournament.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tournament.status === 'published' ? 'Publicado' :
                         tournament.status === 'completed' ? 'Finalizado' :
                         'Rascunho'}
                      </span>
                    </div>
                    
                    {tournament.isPublic && (
                      <div className="flex items-center gap-2">
                        <FaGlobe />
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Público
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {tournament.bracket ? (
                  <Button
                    onClick={() => setShowBracket(tournament)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FaEye />
                    Ver Chaveamento
                  </Button>
                ) : (
                  <Button
                    onClick={() => generateBracket(tournament)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <FaRandom />
                    Gerar Chaveamento
                  </Button>
                )}
                
                <Button
                  onClick={() => startEdit(tournament)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <FaEdit />
                  Editar
                </Button>
                
                <Button
                  onClick={() => togglePublic(tournament)}
                  size="sm"
                  variant={tournament.isPublic ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  <FaGlobe />
                  {tournament.isPublic ? 'Público' : 'Privado'}
                </Button>
                
                <Button
                  onClick={() => deleteTournament(tournament.id)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <FaTrash />
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-12">
            <FaTrophy className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum torneio criado</h3>
            <p className="text-gray-500 mb-6">Crie seu primeiro torneio para começar.</p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <FaPlus />
              Criar Primeiro Torneio
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTournaments