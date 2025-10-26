import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface Player {
  id: string
  name: string
  birthDate: string
  position: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  medicalInfo: string
  registrationDate: string
  documentPhoto?: string // Base64 da foto do documento
  playerPhoto?: string   // Base64 da foto da atleta
}

interface User {
  id: string
  teamName: string
  responsibleName: string
  email: string
  phone: string
  city: string
  password?: string
  foundationYear?: string
  registrationDate: string
  createdAt: string
  players?: Player[]
  role?: 'user' | 'admin'
  enrolledTournaments?: string[] // IDs dos torneios inscritos
}

// Unused interface - commented out to avoid TypeScript warning
// interface AdminUser {
//   id: string
//   username: string
//   password: string
//   role: 'admin'
//   name: string
//   email: string
//   createdAt: string
// }

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (teamName: string, password: string) => Promise<{ success: boolean; message: string }>
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  loading: boolean
  updateUser: (userData: Partial<User>) => void
  addPlayer: (player: Omit<Player, 'id' | 'registrationDate'>) => void
  updatePlayer: (playerId: string, player: Omit<Player, 'id' | 'registrationDate'>) => void
  removePlayer: (playerId: string) => void
  getPlayers: () => Player[]
  // Funções de torneios
  enrollInTournament: (tournamentId: string) => void
  unenrollFromTournament: (tournamentId: string) => void
  getEnrolledTournaments: () => string[]
  // Funções administrativas
  getAllUsers: () => User[]
  deleteUser: (userId: string) => void
  updateUserAsAdmin: (userId: string, userData: Partial<User>) => void
}

interface RegisterData {
  teamName: string
  responsibleName: string
  email: string
  phone: string
  city: string
  password: string
}

interface StoredUser extends User {
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Credenciais administrativas (em produção, isso estaria em um backend seguro)
const ADMIN_CREDENTIALS = {
  username: 'admin_copa_pab',
  password: 'Copa@PAB2025!',
  name: 'Administrador Copa PAB',
  email: 'admin@copa-pab.com'
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se existe usuário logado no localStorage
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      // Verificar se já existe um usuário com este nome de time ou email
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
      
      const existingUser = users.find(
        u => u.teamName.toLowerCase() === userData.teamName.toLowerCase() || 
             u.email.toLowerCase() === userData.email.toLowerCase()
      )

      if (existingUser) {
        if (existingUser.teamName.toLowerCase() === userData.teamName.toLowerCase()) {
          return { success: false, message: 'Já existe um time cadastrado com este nome!' }
        }
        if (existingUser.email.toLowerCase() === userData.email.toLowerCase()) {
          return { success: false, message: 'Já existe uma conta cadastrada com este e-mail!' }
        }
      }

      // Criar novo usuário
      const newUser: StoredUser = {
        id: Date.now().toString(),
        teamName: userData.teamName,
        responsibleName: userData.responsibleName,
        email: userData.email,
        phone: userData.phone,
        city: userData.city,
        password: userData.password, // Em produção, use hash da senha
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      // Salvar no localStorage
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Fazer login automaticamente após o cadastro
      const { password, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

      return { success: true, message: 'Cadastro realizado com sucesso!' }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { success: false, message: 'Erro interno. Tente novamente.' }
    }
  }

  const login = async (teamName: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
      
      const foundUser = users.find(
        u => u.teamName.toLowerCase() === teamName.toLowerCase() && u.password === password
      )

      if (!foundUser) {
        return { success: false, message: 'Nome do time ou senha incorretos!' }
      }      // Login bem-sucedido
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Se é o primeiro login e não há inscrições, adicionar algumas inscrições de exemplo
      if (!userWithoutPassword.enrolledTournaments || userWithoutPassword.enrolledTournaments.length === 0) {
        userWithoutPassword.enrolledTournaments = ['1', '3'] // Inscrever nos torneios 1 e 3 automaticamente
        
        // Atualizar no storage
        const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
        const updatedUsers = users.map(u => 
          u.id === userWithoutPassword.id 
            ? { ...u, enrolledTournaments: userWithoutPassword.enrolledTournaments }
            : u
        )
        localStorage.setItem('users', JSON.stringify(updatedUsers))
      }
      
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

      return { success: true, message: 'Login realizado com sucesso!' }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, message: 'Erro interno. Tente novamente.' }
    }
  }

  const adminLogin = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser: User = {
          id: 'admin',
          teamName: 'Admin',
          responsibleName: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          phone: '',
          city: '',
          registrationDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          role: 'admin'
        }
        
        setUser(adminUser)
        localStorage.setItem('currentUser', JSON.stringify(adminUser))
        
        return { success: true, message: 'Login administrativo realizado com sucesso!' }
      } else {
        return { success: false, message: 'Credenciais administrativas incorretas!' }
      }
    } catch (error) {
      console.error('Erro no login administrativo:', error)
      return { success: false, message: 'Erro interno. Tente novamente.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const updateUserInStorage = (updatedUser: User) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
    const userIndex = users.findIndex(u => u.id === updatedUser.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser }
      localStorage.setItem('users', JSON.stringify(users))
    }
    
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...userData
    }

    updateUserInStorage(updatedUser)
  }

  const addPlayer = (playerData: Omit<Player, 'id' | 'registrationDate'>) => {
    if (!user) return

    const newPlayer: Player = {
      id: Date.now().toString(),
      ...playerData,
      registrationDate: new Date().toLocaleDateString('pt-BR')
    }

    const updatedUser = {
      ...user,
      players: [...(user.players || []), newPlayer]
    }

    updateUserInStorage(updatedUser)
  }

  const updatePlayer = (playerId: string, playerData: Omit<Player, 'id' | 'registrationDate'>) => {
    if (!user) return

    const updatedPlayers = (user.players || []).map(player =>
      player.id === playerId
        ? { ...player, ...playerData }
        : player
    )

    const updatedUser = {
      ...user,
      players: updatedPlayers
    }

    updateUserInStorage(updatedUser)
  }

  const removePlayer = (playerId: string) => {
    if (!user) return

    const updatedPlayers = (user.players || []).filter(player => player.id !== playerId)

    const updatedUser = {
      ...user,
      players: updatedPlayers
    }

    updateUserInStorage(updatedUser)
  }

  const getPlayers = (): Player[] => {
    return user?.players || []
  }

  // Funções administrativas
  const getAllUsers = (): User[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
    return users.map(({ password, ...user }) => user)
  }

  const deleteUser = (userId: string) => {
    if (user?.role !== 'admin') return
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
    const filteredUsers = users.filter(u => u.id !== userId)
    localStorage.setItem('users', JSON.stringify(filteredUsers))
  }
  const updateUserAsAdmin = (userId: string, userData: Partial<User>) => {
    if (user?.role !== 'admin') return
    
    const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[]
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData }
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  // Funções de gerenciamento de torneios
  const enrollInTournament = (tournamentId: string) => {
    if (!user) return

    const enrolledTournaments = user.enrolledTournaments || []
    if (!enrolledTournaments.includes(tournamentId)) {
      const updatedUser = {
        ...user,
        enrolledTournaments: [...enrolledTournaments, tournamentId]
      }
      updateUserInStorage(updatedUser)
    }
  }

  const unenrollFromTournament = (tournamentId: string) => {
    if (!user) return

    const enrolledTournaments = user.enrolledTournaments || []
    const updatedTournaments = enrolledTournaments.filter(id => id !== tournamentId)
    
    const updatedUser = {
      ...user,
      enrolledTournaments: updatedTournaments
    }
    updateUserInStorage(updatedUser)
  }

  const getEnrolledTournaments = (): string[] => {
    return user?.enrolledTournaments || []
  }
  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    logout,
    loading,
    updateUser,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayers,
    enrollInTournament,
    unenrollFromTournament,
    getEnrolledTournaments,
    getAllUsers,
    deleteUser,
    updateUserAsAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext