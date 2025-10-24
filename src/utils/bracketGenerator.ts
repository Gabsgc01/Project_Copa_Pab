export interface Team {
  id: string
  name: string
  coach: string
  registrationDate: string
}

export interface Match {
  id: string
  teamA: Team | null
  teamB: Team | null
  winner: Team | null
  round: number
  position: number
  date?: string
  time?: string
  field?: string
  status: 'pending' | 'in_progress' | 'finished'
  score?: {
    teamA: number
    teamB: number
  }
}

export interface Bracket {
  id: string
  tournamentId: string
  teams: Team[]
  matches: Match[]
  rounds: number
  status: 'generating' | 'ready' | 'in_progress' | 'finished'
  createdAt: string
  updatedAt: string
}

/**
 * Classe responsável por gerenciar chaveamentos de torneios
 */
export class BracketGenerator {
  
  /**
   * Calcula o número de rounds necessários baseado no número de times
   */
  static calculateRounds(teamCount: number): number {
    if (teamCount <= 1) return 0
    return Math.ceil(Math.log2(teamCount))
  }

  /**
   * Calcula o número total de partidas necessárias
   */
  static calculateTotalMatches(teamCount: number): number {
    if (teamCount <= 1) return 0
    return teamCount - 1 // Em um torneio eliminatório, sempre há n-1 partidas
  }

  /**
   * Encontra a próxima potência de 2 maior ou igual ao número dado
   */
  static getNextPowerOfTwo(num: number): number {
    return Math.pow(2, Math.ceil(Math.log2(num)))
  }

  /**
   * Embaralha os times para distribuição aleatória
   */
  static shuffleTeams(teams: Team[]): Team[] {
    const shuffled = [...teams]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Gera o chaveamento completo do torneio
   */
  static generateBracket(teams: Team[], tournamentId: string): Bracket {
    if (teams.length < 2) {
      throw new Error('É necessário pelo menos 2 times para criar um chaveamento')
    }

    const shuffledTeams = this.shuffleTeams(teams)
    const totalRounds = this.calculateRounds(teams.length)
    const bracketSize = this.getNextPowerOfTwo(teams.length)
    
    const matches: Match[] = []
    let matchId = 1

    // Primeira rodada - Oitavas, quartas, etc.
    const firstRoundMatches = bracketSize / 2
    const byes = bracketSize - teams.length // Times que passam direto

    let teamIndex = 0
    
    for (let i = 0; i < firstRoundMatches; i++) {
      const match: Match = {
        id: `match_${matchId++}`,
        teamA: null,
        teamB: null,
        winner: null,
        round: 1,
        position: i,
        status: 'pending'
      }

      // Atribuir times ou criar bye
      if (teamIndex < shuffledTeams.length) {
        match.teamA = shuffledTeams[teamIndex++]
      }
      
      if (teamIndex < shuffledTeams.length) {
        match.teamB = shuffledTeams[teamIndex++]
      }

      // Se apenas um time foi atribuído, ele avança automaticamente
      if (match.teamA && !match.teamB) {
        match.winner = match.teamA
        match.status = 'finished'
      }

      matches.push(match)
    }

    // Gerar as rodadas subsequentes
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round)
      
      for (let i = 0; i < matchesInRound; i++) {
        const match: Match = {
          id: `match_${matchId++}`,
          teamA: null,
          teamB: null,
          winner: null,
          round: round,
          position: i,
          status: 'pending'
        }
        matches.push(match)
      }
    }

    const bracket: Bracket = {
      id: `bracket_${Date.now()}`,
      tournamentId,
      teams: shuffledTeams,
      matches,
      rounds: totalRounds,
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return bracket
  }
  /**
   * Atualiza o resultado de uma partida automaticamente baseado nos gols
   */
  static updateMatchWithScore(bracket: Bracket, matchId: string, goalsTeamA: number, goalsTeamB: number): Bracket {
    const updatedBracket = { ...bracket }
    const matches = [...updatedBracket.matches]
    
    const matchIndex = matches.findIndex(m => m.id === matchId)
    if (matchIndex === -1) {
      throw new Error('Partida não encontrada')
    }

    const match = { ...matches[matchIndex] }
    if (!match.teamA || !match.teamB) {
      throw new Error('Partida deve ter dois times para registrar resultado')
    }

    // Determinar o vencedor automaticamente baseado nos gols
    let winner: Team
    if (goalsTeamA > goalsTeamB) {
      winner = match.teamA
    } else if (goalsTeamB > goalsTeamA) {
      winner = match.teamB
    } else {
      // Em caso de empate, pode ser definido por critérios adicionais
      // Por enquanto, vamos considerar teamA como vencedor em empates
      winner = match.teamA
    }

    match.winner = winner
    match.status = 'finished'
    match.score = {
      teamA: goalsTeamA,
      teamB: goalsTeamB
    }
    
    matches[matchIndex] = match

    // Propagar vencedor para próxima rodada
    this.propagateWinner(matches, match, winner)

    updatedBracket.matches = matches
    updatedBracket.updatedAt = new Date().toISOString()

    // Verificar se o torneio terminou
    const finalMatch = matches.find(m => m.round === updatedBracket.rounds)
    if (finalMatch?.winner) {
      updatedBracket.status = 'finished'
    }

    return updatedBracket
  }

  /**
   * Atualiza o resultado de uma partida e propaga o vencedor
   */
  static updateMatchResult(bracket: Bracket, matchId: string, winner: Team, score?: { teamA: number, teamB: number }): Bracket {
    const updatedBracket = { ...bracket }
    const matches = [...updatedBracket.matches]
    
    const matchIndex = matches.findIndex(m => m.id === matchId)
    if (matchIndex === -1) {
      throw new Error('Partida não encontrada')
    }

    const match = { ...matches[matchIndex] }
    match.winner = winner
    match.status = 'finished'
    if (score) {
      match.score = score
    }
    
    matches[matchIndex] = match

    // Propagar vencedor para próxima rodada
    this.propagateWinner(matches, match, winner)

    updatedBracket.matches = matches
    updatedBracket.updatedAt = new Date().toISOString()

    // Verificar se o torneio terminou
    const finalMatch = matches.find(m => m.round === updatedBracket.rounds)
    if (finalMatch?.winner) {
      updatedBracket.status = 'finished'
    }

    return updatedBracket
  }

  /**
   * Propaga o vencedor para a próxima rodada
   */
  private static propagateWinner(matches: Match[], currentMatch: Match, winner: Team): void {
    if (currentMatch.round === matches.length) return // É a final

    const nextRound = currentMatch.round + 1
    const nextPosition = Math.floor(currentMatch.position / 2)
    
    const nextMatch = matches.find(m => m.round === nextRound && m.position === nextPosition)
    if (!nextMatch) return

    // Determinar se o vencedor vai para teamA ou teamB da próxima partida
    if (currentMatch.position % 2 === 0) {
      nextMatch.teamA = winner
    } else {
      nextMatch.teamB = winner
    }
  }

  /**
   * Adiciona um novo time ao torneio e regenera o chaveamento se necessário
   */
  static addTeamToBracket(bracket: Bracket, newTeam: Team): Bracket {
    const updatedTeams = [...bracket.teams, newTeam]
    
    // Se o torneio ainda não começou, regenerar completamente
    if (bracket.status === 'ready' || bracket.status === 'generating') {
      return this.generateBracket(updatedTeams, bracket.tournamentId)
    }
    
    // Se já começou, não é possível adicionar mais times
    throw new Error('Não é possível adicionar times após o início do torneio')
  }

  /**
   * Remove um time do torneio (apenas se ainda não começou)
   */
  static removeTeamFromBracket(bracket: Bracket, teamId: string): Bracket {
    if (bracket.status === 'in_progress' || bracket.status === 'finished') {
      throw new Error('Não é possível remover times após o início do torneio')
    }

    const updatedTeams = bracket.teams.filter(team => team.id !== teamId)
    
    if (updatedTeams.length < 2) {
      throw new Error('É necessário pelo menos 2 times para manter o torneio')
    }

    return this.generateBracket(updatedTeams, bracket.tournamentId)
  }

  /**
   * Obtém todas as partidas de uma rodada específica
   */
  static getMatchesByRound(bracket: Bracket, round: number): Match[] {
    return bracket.matches.filter(match => match.round === round)
  }

  /**
   * Obtém o próximo jogo que precisa ser jogado
   */
  static getNextMatch(bracket: Bracket): Match | null {
    return bracket.matches.find(match => 
      match.status === 'pending' && 
      match.teamA && 
      match.teamB
    ) || null
  }

  /**
   * Gera nomes das rodadas baseado no número de times
   */
  static getRoundName(round: number, totalRounds: number): string {
    if (totalRounds === 1) return 'Final'
    
    const roundsFromEnd = totalRounds - round + 1
    
    switch (roundsFromEnd) {
      case 1: return 'Final'
      case 2: return 'Semifinal'
      case 3: return 'Quartas de Final'
      case 4: return 'Oitavas de Final'
      case 5: return 'Décima Sexta'
      default: return `${round}ª Rodada`
    }
  }

  /**
   * Calcula estatísticas do chaveamento
   */
  static getBracketStats(bracket: Bracket) {
    const totalMatches = bracket.matches.length
    const finishedMatches = bracket.matches.filter(m => m.status === 'finished').length
    const pendingMatches = bracket.matches.filter(m => m.status === 'pending' && m.teamA && m.teamB).length
    const progress = totalMatches > 0 ? (finishedMatches / totalMatches) * 100 : 0

    return {
      totalTeams: bracket.teams.length,
      totalMatches,
      finishedMatches,
      pendingMatches,
      progress: Math.round(progress),
      currentRound: this.getCurrentRound(bracket),
      champion: this.getChampion(bracket)
    }
  }

  /**
   * Obtém a rodada atual do torneio
   */
  private static getCurrentRound(bracket: Bracket): number {
    for (let round = 1; round <= bracket.rounds; round++) {
      const roundMatches = this.getMatchesByRound(bracket, round)
      const hasUnfinished = roundMatches.some(m => m.status !== 'finished')
      
      if (hasUnfinished) {
        return round
      }
    }
    return bracket.rounds
  }

  /**
   * Obtém o campeão se o torneio terminou
   */
  private static getChampion(bracket: Bracket): Team | null {
    const finalMatch = bracket.matches.find(m => m.round === bracket.rounds)
    return finalMatch?.winner || null
  }
}