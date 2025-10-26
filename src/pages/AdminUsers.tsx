import { useState, useEffect } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useAuth } from '@/contexts/AuthContext'
import { getSafeInitial, getSafeTeamName, getSafeResponsibleName, isValidUser, getSafeDate } from '../utils/safeUtils'
import { Button } from '@/components/ui/button'
import { 
  FaUsers, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaArrowLeft,
  FaFilter,
  FaDownload
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface User {
  id: string
  teamName: string
  responsibleName: string
  email: string
  phone: string
  city: string
  registrationDate: string
  createdAt: string
  players?: Array<{
    id: string
    name: string
    birthDate: string
    position: string
    phone: string
  }>
}

const AdminUsers = () => {
  const { isAdmin, getAllUsers, deleteUser, updateUserAsAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserDetail, setShowUserDetail] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filterCity, setFilterCity] = useState('')

  // Form data para edição
  const [formData, setFormData] = useState({
    teamName: '',
    responsibleName: '',
    email: '',
    phone: '',
    city: ''
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = getAllUsers()
    setUsers(allUsers)
  }

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      getSafeTeamName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSafeResponsibleName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = !filterCity || user.city === filterCity
    
    return matchesSearch && matchesCity
  })

  const cities = [...new Set(users.map(user => user.city))].filter(Boolean).sort()

  const handleDeleteUser = (user: User) => {
    openConfirm({
      title: 'Excluir Time',
      message: `Tem certeza que deseja excluir o time "${getSafeTeamName(user)}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        deleteUser(user.id)
        loadUsers()
        if (showUserDetail?.id === user.id) {
          setShowUserDetail(null)
        }
      }
    })
  }

  // Modal de confirmação
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

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      teamName: user.teamName,
      responsibleName: user.responsibleName,
      email: user.email,
      phone: user.phone,
      city: user.city
    })
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    updateUserAsAdmin(editingUser.id, formData)
    loadUsers()
    setEditingUser(null)
  }

  const exportUsersData = () => {
    const csvContent = [
      ['Time', 'Responsável', 'Email', 'Telefone', 'Cidade', 'Data Cadastro', 'Jogadoras'],
      ...users.map(user => [
        getSafeTeamName(user),
        getSafeResponsibleName(user),
        user.email,
        user.phone,
        user.city,
        getSafeDate(user.registrationDate),
        user.players?.length || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `copa-pab-users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              {filteredUsers.length} de {users.length} usuários
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={exportUsersData}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <FaDownload />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por time, responsável, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
              >
                <option value="">Todas as cidades</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <Button 
              onClick={() => {
                setSearchTerm('')
                setFilterCity('')
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Modal de Edição */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Usuário</h2>
              
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Time
                  </label>
                  <input
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsibleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Salvar Alterações
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingUser(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {showUserDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{showUserDetail.teamName}</h2>
                <Button 
                  onClick={() => setShowUserDetail(null)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Informações do Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Informações do Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Responsável:</span>
                      <p className="text-gray-900">{showUserDetail.responsibleName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{showUserDetail.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Telefone:</span>
                      <p className="text-gray-900">{showUserDetail.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Cidade:</span>
                      <p className="text-gray-900">{showUserDetail.city}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Data de Cadastro:</span>
                      <p className="text-gray-900">{showUserDetail.registrationDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Total de Jogadoras:</span>
                      <p className="text-gray-900">{showUserDetail.players?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de Jogadoras */}
                {showUserDetail.players && showUserDetail.players.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Jogadoras Cadastradas</h3>
                    <div className="space-y-2">
                      {showUserDetail.players.map((player) => (
                        <div key={player.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{player.name}</h4>
                              <p className="text-sm text-gray-600">
                                {player.position} • {player.birthDate} • {player.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de Usuários */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogadoras
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Cadastro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.filter(isValidUser).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-hot-pink to-pink-light rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {getSafeInitial(getSafeTeamName(user))}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{getSafeTeamName(user)}</div>
                          <div className="text-sm text-gray-500">{user.email || 'Email não informado'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getSafeResponsibleName(user)}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.players?.length || 0} jogadoras
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.registrationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setShowUserDetail(user)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <FaEye />
                          Ver
                        </Button>
                        <Button
                          onClick={() => startEdit(user)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <FaEdit />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <FaTrash />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {users.length === 0 ? 'Nenhum usuário cadastrado' : 'Nenhum usuário encontrado'}
            </h3>
            <p className="text-gray-500">
              {users.length === 0 
                ? 'Aguarde os primeiros times se cadastrarem.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
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
    </div>
  )
}

export default AdminUsers