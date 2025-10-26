import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { BracketGenerator, type Bracket, type Match, type Team } from '../utils/bracketGenerator'
import { FaTrophy, FaUsers, FaCrown, FaPlus, FaTrash, FaEdit } from 'react-icons/fa'

interface BracketViewerProps {
  bracket: Bracket
  onUpdateMatch?: (matchId: string, winner: Team, score?: { teamA: number, teamB: number }) => void
  onAddTeam?: (team: Team) => void
  onRemoveTeam?: (teamId: string) => void
  editable?: boolean
}

const BracketViewer: React.FC<BracketViewerProps> = ({
  bracket,
  onUpdateMatch,
  onAddTeam,
  onRemoveTeam,
  editable = false
}) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamCoach, setNewTeamCoach] = useState('')

  const stats = BracketGenerator.getBracketStats(bracket)

  const handleMatchClick = (match: Match) => {
    if (!editable || match.status === 'finished' || !match.teamA || !match.teamB) return
    setSelectedMatch(match)
    setScoreA('')
    setScoreB('')
  }
  const handleUpdateResult = () => {
    if (!selectedMatch || !onUpdateMatch || !scoreA || !scoreB) return
    
    const goalsA = parseInt(scoreA)
    const goalsB = parseInt(scoreB)
    
    // Determinar vencedor automaticamente baseado nos gols
    let winner: Team
    if (goalsA > goalsB && selectedMatch.teamA) {
      winner = selectedMatch.teamA
    } else if (goalsB > goalsA && selectedMatch.teamB) {
      winner = selectedMatch.teamB
    } else if (selectedMatch.teamA) {
      // Em caso de empate, considera teamA como vencedor
      winner = selectedMatch.teamA
    } else {
      return // Não deve acontecer
    }

    const score = {
      teamA: goalsA,
      teamB: goalsB
    }

    onUpdateMatch(selectedMatch.id, winner, score)
    setSelectedMatch(null)
  }

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamCoach.trim() || !onAddTeam) return
    
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName,
      coach: newTeamCoach,
      registrationDate: new Date().toISOString()
    }

    onAddTeam(newTeam)
    setNewTeamName('')
    setNewTeamCoach('')
  }

  const renderMatch = (match: Match) => {
    const roundName = BracketGenerator.getRoundName(match.round, bracket.rounds)
    
    return (
      <div 
        key={match.id}
        className={`bg-white border-2 rounded-lg p-3 shadow-sm transition-all cursor-pointer ${
          match.status === 'finished' 
            ? 'border-green-300 bg-green-50' 
            : match.teamA && match.teamB 
              ? 'border-hot-pink hover:border-pink-light-1 hover:shadow-md' 
              : 'border-gray-200 bg-gray-50'
        }`}
        onClick={() => handleMatchClick(match)}
      >
        <div className="text-xs text-gray-500 mb-2 text-center font-button">
          {roundName}
        </div>
        
        {/* Time A */}
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner?.id === match.teamA?.id ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-50'
        }`}>
          <span className="text-sm truncate">
            {match.teamA?.name || 'A definir'}
          </span>
          {match.score && (
            <span className="text-sm font-bold">
              {match.score.teamA}
            </span>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 my-1">vs</div>

        {/* Time B */}
        <div className={`flex items-center justify-between p-2 rounded ${
          match.winner?.id === match.teamB?.id ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-50'
        }`}>
          <span className="text-sm truncate">
            {match.teamB?.name || 'A definir'}
          </span>
          {match.score && (
            <span className="text-sm font-bold">
              {match.score.teamB}
            </span>
          )}
        </div>

        {match.status === 'finished' && match.winner && (
          <div className="mt-2 text-center">
            <FaCrown className="inline text-yellow-500 text-xs" />
            <span className="text-xs text-yellow-700 ml-1">
              {match.winner.name}
            </span>
          </div>
        )}
      </div>
    )
  }

  const groupMatchesByRound = () => {
    const rounds: { [key: number]: Match[] } = {}
    
    for (let i = 1; i <= bracket.rounds; i++) {
      rounds[i] = BracketGenerator.getMatchesByRound(bracket, i)
    }
    
    return rounds
  }

  const rounds = groupMatchesByRound()

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Estatísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTrophy className="text-hot-pink" />
            Chaveamento do Torneio
          </h2>
          <div className="text-sm text-gray-600">
            Status: <span className={`font-medium ${
              bracket.status === 'finished' ? 'text-green-600' : 
              bracket.status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {bracket.status === 'finished' ? 'Finalizado' :
               bracket.status === 'in_progress' ? 'Em Andamento' : 'Aguardando'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-pink-light p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hot-pink">{stats.totalTeams}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <FaUsers className="text-xs" />
              Times
            </div>
          </div>
          
          <div className="bg-pink-light p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hot-pink">{stats.finishedMatches}</div>
            <div className="text-sm text-gray-600">Jogos Realizados</div>
          </div>
          
          <div className="bg-pink-light p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hot-pink">{stats.pendingMatches}</div>
            <div className="text-sm text-gray-600">Próximos Jogos</div>
          </div>
          
          <div className="bg-pink-light p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hot-pink">{stats.progress}%</div>
            <div className="text-sm text-gray-600">Progresso</div>
          </div>
        </div>

        {stats.champion && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
            <div className="flex items-center justify-center gap-2">
              <FaCrown className="text-yellow-600 text-xl" />
              <span className="text-lg font-bold text-yellow-800">
                Campeã: {stats.champion.name}
              </span>
              <FaCrown className="text-yellow-600 text-xl" />
            </div>
          </div>
        )}
      </div>

      {/* Adicionar Times (se editável e não iniciado) */}
      {editable && (bracket.status === 'ready' || bracket.status === 'generating') && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaPlus className="text-hot-pink" />
            Gerenciar Times
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Nome do time"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <Input
              placeholder="Nome da treinadora"
              value={newTeamCoach}
              onChange={(e) => setNewTeamCoach(e.target.value)}
            />
            <Button onClick={handleAddTeam} className="flex items-center gap-2">
              <FaPlus />
              Adicionar Time
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Times Inscritos:</h4>
            {bracket.teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{team.name}</span>
                  <span className="text-sm text-gray-600 ml-2">({team.coach})</span>
                </div>
                {onRemoveTeam && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveTeam(team.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chaveamento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Chaveamento</h3>
        
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {Object.entries(rounds).map(([roundNum, matches]) => (
              <div key={roundNum} className="flex-shrink-0">
                <h4 className="text-center font-bold text-gray-700 mb-4">
                  {BracketGenerator.getRoundName(parseInt(roundNum), bracket.rounds)}
                </h4>
                <div className="space-y-4 min-w-[200px]">
                  {matches.map(renderMatch)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para Atualizar Resultado */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaEdit className="text-hot-pink" />
              Registrar Resultado
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedMatch.teamA?.name}
                  </label>
                  <Input
                    type="number"
                    placeholder="Gols"
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                  />
                </div>
                <div className="text-gray-500">vs</div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedMatch.teamB?.name}
                  </label>
                  <Input
                    type="number"
                    placeholder="Gols"
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                  />                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Digite o número de gols de cada time. O vencedor será determinado automaticamente.
              </div><div className="flex gap-3">
                <Button
                  onClick={handleUpdateResult}
                  className="w-full"
                  disabled={!scoreA || !scoreB}
                >
                  Registrar Resultado
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setSelectedMatch(null)}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BracketViewer