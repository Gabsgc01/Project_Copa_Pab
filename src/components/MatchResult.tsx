import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Match } from '@/utils/bracketGenerator'

interface MatchResultProps {
  match: Match
  onUpdateResult: (matchId: string, goalsTeamA: number, goalsTeamB: number) => void
  isAdmin?: boolean
}

const MatchResult: React.FC<MatchResultProps> = ({ match, onUpdateResult, isAdmin = false }) => {
  const [goalsTeamA, setGoalsTeamA] = useState(match.score?.teamA?.toString() || '')
  const [goalsTeamB, setGoalsTeamB] = useState(match.score?.teamB?.toString() || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const goalsA = parseInt(goalsTeamA) || 0
    const goalsB = parseInt(goalsTeamB) || 0
    
    onUpdateResult(match.id, goalsA, goalsB)
  }

  const canEdit = isAdmin && match.teamA && match.teamB && match.status !== 'finished'

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          {match.round === 1 ? 'Oitavas' : 
           match.round === 2 ? 'Quartas' : 
           match.round === 3 ? 'Semifinal' : 
           'Final'}
        </h3>
        <span className={`px-2 py-1 rounded text-xs ${
          match.status === 'finished' ? 'bg-green-100 text-green-800' :
          match.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {match.status === 'finished' ? 'Finalizado' :
           match.status === 'in_progress' ? 'Em andamento' :
           'Aguardando'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span className="font-medium text-gray-800">
              {match.teamA?.name || 'A definir'}
            </span>
          </div>
          {canEdit ? (
            <Input
              type="number"
              min="0"
              value={goalsTeamA}
              onChange={(e) => setGoalsTeamA(e.target.value)}
              className="w-16 text-center"
              placeholder="0"
            />
          ) : (
            <div className="w-16 text-center font-bold text-lg">
              {match.score?.teamA ?? '-'}
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">vs</div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span className="font-medium text-gray-800">
              {match.teamB?.name || 'A definir'}
            </span>
          </div>
          {canEdit ? (
            <Input
              type="number"
              min="0"
              value={goalsTeamB}
              onChange={(e) => setGoalsTeamB(e.target.value)}
              className="w-16 text-center"
              placeholder="0"
            />
          ) : (
            <div className="w-16 text-center font-bold text-lg">
              {match.score?.teamB ?? '-'}
            </div>
          )}
        </div>

        {/* Winner Display */}
        {match.winner && (
          <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
            <span className="text-green-800 font-medium">
              🏆 Vencedor: {match.winner.name}
            </span>
          </div>
        )}

        {/* Submit Button */}
        {canEdit && (
          <form onSubmit={handleSubmit}>
            <Button type="submit" className="w-full mt-4">
              Registrar Resultado
            </Button>
          </form>
        )}
      </div>

      {/* Match Details */}
      {(match.date || match.time || match.field) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-1">
            {match.date && (
              <div>📅 {new Date(match.date).toLocaleDateString('pt-BR')}</div>
            )}
            {match.time && (
              <div>🕐 {match.time}</div>
            )}
            {match.field && (
              <div>🏟️ {match.field}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchResult
