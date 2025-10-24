import { useState } from 'react'
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

  // Formulário usando os campos corretos do TournamentContext
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    registrationDeadline: '',
    location: '',
    maxTeams: 16,
    registeredTeams: 0,
    prize: '',
    imageUrl: '/api/placeholder/400/300',
    isRegistrationOpen: true,
    status: 'draft' as 'draft' | 'published' | 'completed',
    isPublic: false
  })

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar se todas as informações estão completas
    const isComplete = !!(formData.title.trim() && 
                         formData.description.trim() && 
                         formData.date && 
                         formData.registrationDeadline && 
                         formData.location.trim() &&
                         formData.maxTeams > 0)
    
    if (editingTournament) {
      // Editar torneio existente
      updateTournament(editingTournament.id, {
        ...formData,
        status: isComplete ? 'published' : 'draft',
        isPublic: isComplete
      })
      setEditingTournament(null)
    } else {
      // Criar novo torneio
      addTournament({
        ...formData,
        status: isComplete ? 'published' : 'draft',
        isPublic: isComplete
      })
    }
    
    setShowCreateForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      registrationDeadline: '',
      location: '',
      maxTeams: 16,
      registeredTeams: 0,
      prize: '',
      imageUrl: '/api/placeholder/400/300',
      isRegistrationOpen: true,
      status: 'draft',
      isPublic: false
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este torneio? Esta ação não pode ser desfeita.')) {
      deleteTournament(id)
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
    
    // Criar tournament com bracket para exibição
    const tournamentWithBracket: AdminTournament = {
      ...tournament,
      bracket
    }
    
    setShowBracket(tournamentWithBracket)
    
    // Atualizar status para published se tiver bracket
    updateTournament(tournament.id, { 
      status: 'published',
      isPublic: true 
    })
  }

  const togglePublic = (tournament: Tournament) => {
    updateTournament(tournament.id, {
      isPublic: !tournament.isPublic
    })
  }

  const handleUpdateMatch = (tournamentId: string, matchId: string, winner: Team, score?: { teamA: number, teamB: number }) => {
    if (!showBracket?.bracket) return

    try {
      const updatedBracket = BracketGenerator.updateMatchWithScore(
        showBracket.bracket,
        matchId,
        score?.teamA || 0,
        score?.teamB || 0
      )
      
      setShowBracket({ ...showBracket, bracket: updatedBracket })
    } catch (error) {
      alert(`Erro ao atualizar partida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const startEdit = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setFormData({
      title: tournament.title,
      description: tournament.description,
      date: tournament.date,
      registrationDeadline: tournament.registrationDeadline,
      location: tournament.location,
      maxTeams: tournament.maxTeams,
      registeredTeams: tournament.registeredTeams,
      prize: tournament.prize,
      imageUrl: tournament.imageUrl,
      isRegistrationOpen: tournament.isRegistrationOpen,
      status: tournament.status,
      isPublic: tournament.isPublic
    })
    setShowCreateForm(true)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-pink-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FaFlag className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Você precisa ser administrador para acessar esta área.</p>
          <Button asChild>
            <Link to="/admin">Fazer Login como Admin</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (showBracket) {
    return (
      <div className="min-h-screen bg-pink-light">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowBracket(null)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">
                Chaveamento - {showBracket.title}
              </h1>
            </div>
            
            <Button 
              onClick={() => togglePublic(showBracket)}
              variant={showBracket.isPublic ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <FaGlobe />
              {showBracket.isPublic ? 'Público' : 'Privado'}
            </Button>
          </div>

          <BracketViewer 
            bracket={showBracket.bracket!}
            onUpdateMatch={handleUpdateMatch}
            isAdmin={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FaTrophy className="text-hot-pink" />
            Gerenciar Torneios
          </h1>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-hot-pink hover:bg-pink-600"
          >
            <FaPlus />
            Novo Torneio
          </Button>
        </div>

        {/* Formulário de Criação/Edição */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingTournament ? 'Editar Torneio' : 'Criar Novo Torneio'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Torneio *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    placeholder="Nome do torneio"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={handleInputChange('location')}
                    placeholder="Local do torneio"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data do Torneio *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange('date')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Inscrições *
                  </label>
                  <Input
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange('registrationDeadline')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Times
                  </label>
                  <Input
                    type="number"
                    min="4"
                    max="32"
                    value={formData.maxTeams}
                    onChange={handleInputChange('maxTeams')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premiação
                  </label>
                  <Input
                    value={formData.prize}
                    onChange={handleInputChange('prize')}
                    placeholder="Ex: R$ 5.000 + Troféus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Descrição do torneio"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-hot-pink focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRegistrationOpen"
                  checked={formData.isRegistrationOpen}
                  onChange={handleInputChange('isRegistrationOpen')}
                />
                <label htmlFor="isRegistrationOpen" className="text-sm text-gray-700">
                  Inscrições abertas
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-hot-pink hover:bg-pink-600">
                  {editingTournament ? 'Atualizar' : 'Criar'} Torneio
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingTournament(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Torneios */}
        <div className="grid gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{tournament.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tournament.status === 'published' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tournament.status === 'published' ? 'Publicado' :
                       tournament.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </span>
                    {tournament.isPublic && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        <FaGlobe className="inline mr-1" />
                        Público
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{tournament.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>{new Date(tournament.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>Até {tournament.maxTeams} times</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaFlag />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => generateBracket(tournament)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FaRandom />
                    Chaveamento
                  </Button>
                  <Button
                    onClick={() => startEdit(tournament)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FaEdit />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(tournament.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum torneio encontrado</h3>
              <p className="text-gray-500 mb-6">Comece criando seu primeiro torneio!</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-hot-pink hover:bg-pink-600"
              >
                <FaPlus className="mr-2" />
                Criar Primeiro Torneio
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTournaments
