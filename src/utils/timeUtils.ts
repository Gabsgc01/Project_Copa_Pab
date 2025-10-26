export const isTournamentFinished = (tournament: { date?: string; status?: string } | undefined): boolean => {
  if (!tournament) return false
  try {
    if (tournament.status === 'completed') return true
    if (!tournament.date) return false
    const today = new Date()
    const tournamentDate = new Date(tournament.date)
    // se a data do torneio já passou ou é hoje, considera finalizado
    return tournamentDate <= today
  } catch (e) {
    return false
  }
}

export const formatDateBR = (dateString?: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
