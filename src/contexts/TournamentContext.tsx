import React, { createContext, useContext, useState, useEffect } from 'react'
import { isTournamentFinished } from '@/utils/timeUtils'
import img2018 from '@/assets/imgs/editions/edition-2018.svg'
import img2019 from '@/assets/imgs/editions/edition-2019.svg'
import img2020 from '@/assets/imgs/editions/edition-2020.svg'
import img2021 from '@/assets/imgs/editions/edition-2021.svg'
import img2022 from '@/assets/imgs/editions/edition-2022.svg'
import img2023 from '@/assets/imgs/editions/edition-2023.svg'
import img2024 from '@/assets/imgs/editions/edition-2024.svg'
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
  winner?: string
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
          imageUrl: img2024,
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
          imageUrl: img2023,
          isRegistrationOpen: true,
          status: 'published',
          isPublic: true,
          createdAt: '2024-12-15T00:00:00Z',
          createdBy: 'admin'
        },
        {
          id: '3',
          title: 'Copa PAB 2024',
          description: 'Edição histórica da Copa PAB — jogos intensos, fair-play e grandes emoções.',
          date: '2024-04-14',
          registrationDeadline: '2024-04-01',
          location: 'Centro Esportivo de Itaquera - São Paulo/SP',
          maxTeams: 8,
          registeredTeams: 8,
          prize: 'R$ 5.000 + Troféus',
          imageUrl: img2022,
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2024-02-01T00:00:00Z',
          createdBy: 'admin',
          winner: 'Estrelas da Zona Leste'
        },
        {
          id: '4',
          title: 'Copa PAB 2023',
          description: 'A edição de 2023 consolidou a presença feminina nos campos locais, com disputa acirrada até a final.',
          date: '2023-05-20',
          registrationDeadline: '2023-05-01',
          location: 'Estádio Municipal - Campinas/SP',
          maxTeams: 10,
          registeredTeams: 10,
          prize: 'Troféus + Kits Esportivos',
          imageUrl: img2021,
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2023-02-10T00:00:00Z',
          createdBy: 'admin',
          winner: 'Fênix FC'
        },
        {
          id: '5',
          title: 'Copa PAB 2022',
          description: 'Em 2022 tivemos recorde de participação e muitas atletas reveladas para o futebol amador.',
          date: '2022-06-12',
          registrationDeadline: '2022-05-25',
          location: 'Centro Esportivo Zona Sul - São Paulo/SP',
          maxTeams: 12,
          registeredTeams: 12,
          prize: 'Medalhas + Troféus',
          imageUrl: img2020,
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2022-03-05T00:00:00Z',
          createdBy: 'admin',
          winner: 'Unidas FC'
        },
        {
          id: '6',
          title: 'Copa PAB 2021',
          description: 'Primeira edição oficial da Copa PAB, marcada pelo espírito comunitário e grande participação local.',
          date: '2021-09-18',
          registrationDeadline: '2021-09-01',
          location: 'Campo da Vila Olímpica - Santo André/SP',
          maxTeams: 8,
          registeredTeams: 8,
          prize: 'Troféu + Certificados',
          imageUrl: img2019,
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2021-06-10T00:00:00Z',
          createdBy: 'admin',
          winner: 'Guerreiras Unidos'
        }
        ,
        {
          id: '7',
          title: 'Copa PAB 2020',
          description: 'Edição marcada por adaptações e muita resiliência das equipes participantes.',
          date: '2020-10-10',
          registrationDeadline: '2020-09-25',
          location: 'Centro Esportivo Municipal - São Bernardo do Campo/SP',
          maxTeams: 8,
          registeredTeams: 8,
          prize: 'Troféus e Kits',
          imageUrl: img2018,
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2020-07-01T00:00:00Z',
          createdBy: 'admin',
          winner: 'Lusas FC'
        },
        {
          id: '8',
          title: 'Copa PAB 2019',
          description: 'Copa PAB expandiu em 2019 com mais times e apoio local.',
          date: '2019-08-05',
          registrationDeadline: '2019-07-20',
          location: 'Estádio Regional - Santos/SP',
          maxTeams: 10,
          registeredTeams: 10,
          prize: 'Medalhas e Troféus',
          imageUrl: '/api/placeholder/400/300',
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2019-04-02T00:00:00Z',
          createdBy: 'admin',
          winner: 'Maré Alta FC'
        },
        {
          id: '9',
          title: 'Copa PAB 2018',
          description: 'Edição inaugural que deu início à tradição da Copa PAB na região.',
          date: '2018-11-11',
          registrationDeadline: '2018-10-20',
          location: 'Campo Central - São Paulo/SP',
          maxTeams: 6,
          registeredTeams: 6,
          prize: 'Troféus',
          imageUrl: '/api/placeholder/400/300',
          isRegistrationOpen: false,
          status: 'completed',
          isPublic: true,
          createdAt: '2018-07-15T00:00:00Z',
          createdBy: 'admin',
          winner: 'Time das Amigas'
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
    return tournaments.filter(tournament => isTournamentFinished(tournament))
  }
  const getTournamentsByUser = (userId: string) => {
    return tournaments.filter(tournament => tournament.createdBy === userId)
  }

  const enrollTeamInTournament = (tournamentId: string, _teamId: string): boolean => {
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

  const unenrollTeamFromTournament = (tournamentId: string, _teamId: string): boolean => {
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
