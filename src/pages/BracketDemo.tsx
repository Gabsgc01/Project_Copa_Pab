import { useState } from 'react'
import { Button } from '@/components/ui/button'
import NavigationHeader from '@/components/NavigationHeader'
import BracketViewer from '@/components/BracketViewer'
import Footer from '@/components/Footer'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { BracketGenerator, type Bracket, type Team } from '@/utils/bracketGenerator'
import { FaTrophy, FaRandom, FaPlus } from 'react-icons/fa'

const BracketDemo = () => {
  const [bracket, setBracket] = useState<Bracket | null>(null)
  const tournamentName = 'Copa PAB 2025'

  // Times de exemplo
  const sampleTeams: Team[] = [
    { id: '1', name: 'Amazonas FC', coach: 'Maria Silva', registrationDate: '2025-01-15' },
    { id: '2', name: 'Panteras Rosa', coach: 'Ana Santos', registrationDate: '2025-01-16' },
    { id: '3', name: 'Leoas do Norte', coach: 'Carla Lima', registrationDate: '2025-01-17' },
    { id: '4', name: 'Tigres United', coach: 'Juliana Costa', registrationDate: '2025-01-18' },
    { id: '5', name: 'Estrelas FC', coach: 'Fernanda Oliveira', registrationDate: '2025-01-19' },
    { id: '6', name: 'Águias Douradas', coach: 'Patricia Rocha', registrationDate: '2025-01-20' },
  ]

  const createSampleBracket = () => {
    const newBracket = BracketGenerator.generateBracket(sampleTeams, 'tournament_demo')
    setBracket(newBracket)
  }

  const createEmptyBracket = () => {
    const minimalTeams = sampleTeams.slice(0, 2) // Apenas 2 times para começar
    const newBracket = BracketGenerator.generateBracket(minimalTeams, 'tournament_empty')
    setBracket(newBracket)
  }

  const handleUpdateMatch = (matchId: string, winner: Team, score?: { teamA: number, teamB: number }) => {
    if (!bracket) return
    
    try {
      const updatedBracket = BracketGenerator.updateMatchResult(bracket, matchId, winner, score)
      setBracket(updatedBracket)
    } catch (error) {
      alert(`Erro ao atualizar partida: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const handleAddTeam = (newTeam: Team) => {
    if (!bracket) return
    
    try {
      const updatedBracket = BracketGenerator.addTeamToBracket(bracket, newTeam)
      setBracket(updatedBracket)
    } catch (error) {
      alert(`Erro ao adicionar time: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  const handleRemoveTeam = (teamId: string) => {
    if (!bracket) return
    
    openConfirm({
      title: 'Remover Time',
      message: 'Tem certeza que deseja remover este time? O chaveamento será regenerado.',
      onConfirm: () => {
        try {
          const updatedBracket = BracketGenerator.removeTeamFromBracket(bracket, teamId)
          setBracket(updatedBracket)
        } catch (error) {
          alert(`Erro ao remover time: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
        }
      }
    })
  }

  // Modal state for confirmations
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

  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4">
            <FaTrophy className="text-hot-pink" />
            Sistema de Chaveamento Automático
          </h1>
          <p className="text-gray-600 mb-6">
            Demonstração do sistema que gera automaticamente os chaveamentos dos torneios conforme os times se inscrevem.
          </p>

          {!bracket ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Criar Novo Torneio:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={createSampleBracket}
                  className="flex items-center gap-2 h-20 text-lg"
                >
                  <FaRandom />
                  <div className="text-left">
                    <div>Torneio com 6 Times</div>
                    <div className="text-sm opacity-80">Exemplo completo</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={createEmptyBracket}
                  variant="outline"
                  className="flex items-center gap-2 h-20 text-lg border-2"
                >
                  <FaPlus />
                  <div className="text-left">
                    <div>Começar com 2 Times</div>
                    <div className="text-sm opacity-80">Adicione conforme necessário</div>
                  </div>
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-blue-800 mb-2">🎯 Funcionalidades do Sistema:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• <strong>Chaveamento Automático:</strong> Gera eliminatórias balanceadas</li>
                  <li>• <strong>Adição Dinâmica:</strong> Adicione times e o chaveamento se ajusta automaticamente</li>
                  <li>• <strong>Controle de Resultados:</strong> Registre placares e vencedores avançam automaticamente</li>
                  <li>• <strong>Visualização Clara:</strong> Interface intuitiva para acompanhar o progresso</li>
                  <li>• <strong>Estatísticas:</strong> Acompanhe o progresso do torneio em tempo real</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setBracket(null)}
                variant="outline"
              >
                Criar Novo Torneio
              </Button>
              
              <div className="text-sm text-gray-600">
                Torneio: <strong>{tournamentName}</strong> • 
                {bracket.teams.length} times • 
                {bracket.rounds} rodadas
              </div>
            </div>
          )}
        </div>

        {/* Chaveamento */}
        {bracket && (
          <BracketViewer
            bracket={bracket}
            onUpdateMatch={handleUpdateMatch}
            onAddTeam={handleAddTeam}
            onRemoveTeam={handleRemoveTeam}
            editable={true}
          />
        )}

        {/* Informações sobre o Sistema */}
        {!bracket && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Como Funciona o Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🔄 Geração Automática</h3>
                <p className="text-gray-600 mb-4">
                  O sistema calcula automaticamente o número de rodadas necessárias e 
                  organiza os times em um formato de eliminatória simples.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-3">⚖️ Balanceamento</h3>
                <p className="text-gray-600">
                  Os times são distribuídos aleatoriamente para garantir equilíbrio, 
                  e o sistema lida com números ímpares criando "byes" automaticamente.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Acompanhamento</h3>
                <p className="text-gray-600 mb-4">
                  Visualize o progresso em tempo real, registre resultados e 
                  acompanhe estatísticas completas do torneio.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🏆 Flexibilidade</h3>
                <p className="text-gray-600">
                  Adicione ou remova times antes do início, e o chaveamento 
                  se reorganiza automaticamente para manter a competição justa.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
        <ConfirmModal
          open={confirmOpen}
          title={confirmTitle}
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setConfirmOpen(false)}
        />

      <Footer />
    </div>
  )
}

export default BracketDemo