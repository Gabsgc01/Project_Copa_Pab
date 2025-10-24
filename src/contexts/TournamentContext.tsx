import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface Tournament {
  id: string
  title: string
  description: string
  date: string
  registrationDeadline: string
  location: string
  maxTeams: number
  registeredTeams: number
  prize: string
  imageUrl: string
  isRegistrationOpen: boolean
  status: 'draft' | 'published' | 'completed'
  isPublic: boolean
  createdAt: string
  createdBy?: string // admin ID who created it
}

interface TournamentContextType {
  tournaments: Tournament[]
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => void
  updateTournament: (id: string, tournament: Partial<Tournament>) => void
  deleteTournament: (id: string) => void
  getTournament: (id: string) => Tournament | undefined
  getPublicTournaments: () => Tournament[]
  getCompletedTournaments: () => Tournament[]
  getTournamentsByUser: (userId: string) => Tournament[]
  enrollTeamInTournament: (tournamentId: string, teamId: string) => boolean
  unenrollTeamFromTournament: (tournamentId: string, teamId: string) => boolean
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

export const useTournaments = () => {
  const context = useContext(TournamentContext)
  if (context === undefined) {
    throw new Error('useTournaments must be used within a TournamentProvider')
  }
  return context
}

interface TournamentProviderProps {
  children: ReactNode
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    // Carregar torneios do localStorage
    const storedTournaments = localStorage.getItem('tournaments')
    if (storedTournaments) {
      setTournaments(JSON.parse(storedTournaments))
    } else {
      // Inicializar com dados mock se não houver dados
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          title: 'Copa PAB Verão 2025',
          description: 'A maior competição de futebol feminino da região volta com tudo!',
          date: '2025-03-15',
          registrationDeadline: '2025-02-28',
          location: 'Centro Esportivo Municipal - São Paulo/SP',
          maxTeams: 32,
          registeredTeams: 28,
          prize: 'R$ 10.000 para as campeãs + Troféus',
          imageUrl: '/api/placeholder/400/300',
          isRegistrationOpen: true,
          status: 'published',
          isPublic: true,
          createdAt: '2024-12-01T00:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '2',
          title: 'Torneio Revelação PAB',
          description: 'Competição especial voltada para equipes iniciantes.',
          date: '2025-04-22',
          registrationDeadline: '2025-04-10',
          location: 'Complexo Esportivo Vila Madalena - São Paulo/SP',
          maxTeams: 16,
          registeredTeams: 8,
          prize: 'Medalhas + Material esportivo + Certificados',
          imageUrl: '/api/placeholder/400/300',
          isRegistrationOpen: true,
          status: 'published',
          isPublic: true,
          createdAt: '2024-12-15T00:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '3',
          title: 'Copa PAB 2024',
          description: 'Torneio concluído com grande sucesso!',
          date: '2024-04-14',
          registrationDeadline: '2024-04-01',
          location: 'Centro Esportivo de Itaquera - São Paulo/SP',
          maxTeams: 8,
          registeredTeams: 8,
          prize: 'R$ 5.000 + Troféus',
          imageUrl: '/api/placeholder/400/300',
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2024-02-01T00:00:00Z',
          createdBy: 'admin'
        }
      ]
      localStorage.setItem('tournaments', JSON.stringify(mockTournaments))
      setTournaments(mockTournaments)
    }
  }, [])

  const saveTournaments = (updatedTournaments: Tournament[]) => {
    setTournaments(updatedTournaments)
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
  }

  const addTournament = (tournamentData: Omit<Tournament, 'id' | 'createdAt'>) => {
    const newTournament: Tournament = {
      id: Date.now().toString(),
      ...tournamentData,
      createdAt: new Date().toISOString()
    }
    const updatedTournaments = [...tournaments, newTournament]
    saveTournaments(updatedTournaments)
  }

  const updateTournament = (id: string, tournamentData: Partial<Tournament>) => {
    const updatedTournaments = tournaments.map(tournament =>
      tournament.id === id ? { ...tournament, ...tournamentData } : tournament
    )
    saveTournaments(updatedTournaments)
  }

  const deleteTournament = (id: string) => {
    const updatedTournaments = tournaments.filter(tournament => tournament.id !== id)
    saveTournaments(updatedTournaments)
  }

  const getTournament = (id: string) => {
    return tournaments.find(tournament => tournament.id === id)
  }

  const getPublicTournaments = () => {
    return tournaments.filter(tournament => tournament.isPublic && tournament.status === 'published')
  }

  const getCompletedTournaments = () => {
    return tournaments.filter(tournament => tournament.status === 'completed')
  }
  const getTournamentsByUser = (userId: string) => {
    return tournaments.filter(tournament => tournament.createdBy === userId)
  }

  const enrollTeamInTournament = (tournamentId: string, teamId: string): boolean => {
    const tournament = tournaments.find(t => t.id === tournamentId)
    if (!tournament || tournament.registeredTeams >= tournament.maxTeams) {
      return false
    }
    
    const updatedTournament = {
      ...tournament,
      registeredTeams: tournament.registeredTeams + 1
    }
    
    updateTournament(tournamentId, updatedTournament)
    return true
  }

  const unenrollTeamFromTournament = (tournamentId: string, teamId: string): boolean => {
    const tournament = tournaments.find(t => t.id === tournamentId)
    if (!tournament || tournament.registeredTeams <= 0) {
      return false
    }
    
    const updatedTournament = {
      ...tournament,
      registeredTeams: tournament.registeredTeams - 1
    }
    
    updateTournament(tournamentId, updatedTournament)
    return true
  }
  const value: TournamentContextType = {
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    getTournament,
    getPublicTournaments,
    getCompletedTournaments,
    getTournamentsByUser,
    enrollTeamInTournament,
    unenrollTeamFromTournament
  }

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}

export default TournamentContext
