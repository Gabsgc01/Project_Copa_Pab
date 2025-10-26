import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { useAuth } from '@/contexts/AuthContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import PhotoUploader from '@/components/PhotoUploader'
import DocumentTester from '@/components/DocumentTester'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { FaUsers, FaUser, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaPhone, FaMedkit, FaIdCard, FaCamera, FaFlask } from 'react-icons/fa'

const ManagePlayers = () => {
  const { user, addPlayer, updatePlayer, removePlayer, getPlayers } = useAuth()
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [showDocumentTester, setShowDocumentTester] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    birthDate: '',
    position: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
    documentPhoto: '',
    playerPhoto: ''
  })

  const players = getPlayers()

  const positions = [
    'Goleira',
    'Zagueira',
    'Lateral Direita',
    'Lateral Esquerda',
    'Volante',
    'Meia',
    'Atacante'
  ]

  // Modal de confirmação para ações (ex: remover jogadora)
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

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewPlayer(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPlayer.name || !newPlayer.birthDate || !newPlayer.position) {
      alert('Preencha pelo menos o nome, data de nascimento e posição!')
      return
    }

    if (!newPlayer.documentPhoto) {
      alert('A foto do documento é obrigatória!')
      return
    }

    if (!newPlayer.playerPhoto) {
      alert('A foto da atleta é obrigatória!')
      return
    }

    addPlayer(newPlayer)
    setNewPlayer({
      name: '',
      birthDate: '',
      position: '',
      phone: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalInfo: '',
      documentPhoto: '',
      playerPhoto: ''
    })
    setIsAddingPlayer(false)
    
    alert('Jogadora cadastrada com sucesso!')
  }

  const handleEditPlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId)
    if (player) {
      setNewPlayer({
        name: player.name,
        birthDate: player.birthDate,
        position: player.position,
        phone: player.phone,
        emergencyContact: player.emergencyContact,
        emergencyPhone: player.emergencyPhone,
        medicalInfo: player.medicalInfo,
        documentPhoto: player.documentPhoto || '',
        playerPhoto: player.playerPhoto || ''
      })
      setEditingPlayer(playerId)
    }
  }

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPlayer.name || !newPlayer.birthDate || !newPlayer.position) {
      alert('Preencha pelo menos o nome, data de nascimento e posição!')
      return
    }

    if (!newPlayer.documentPhoto) {
      alert('A foto do documento é obrigatória!')
      return
    }

    if (!newPlayer.playerPhoto) {
      alert('A foto da atleta é obrigatória!')
      return
    }

    if (editingPlayer) {
      updatePlayer(editingPlayer, newPlayer)
    }

    setNewPlayer({
      name: '',
      birthDate: '',
      position: '',
      phone: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalInfo: '',
      documentPhoto: '',
      playerPhoto: ''
    })
    setEditingPlayer(null)
    alert('Jogadora atualizada com sucesso!')
  }

  const handleDeletePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId)
    if (player) {
      openConfirm({
        title: 'Remover Jogadora',
        message: `Tem certeza que deseja remover ${player.name} do time?`,
        onConfirm: () => {
          removePlayer(playerId)
          alert('Jogadora removida do time!')
        }
      })
    }
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const cancelEdit = () => {
    setEditingPlayer(null)
    setIsAddingPlayer(false)
    setNewPlayer({
      name: '',
      birthDate: '',
      position: '',
      phone: '',
      emergencyContact: '',
      emergencyPhone: '',
      medicalInfo: '',
      documentPhoto: '',
      playerPhoto: ''
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FaUsers className="text-hot-pink" />
                  Gerenciar Jogadoras
                </h1>
                <p className="text-gray-600 mt-2">
                  Cadastre e gerencie as jogadoras do time <strong>{user?.teamName}</strong>
                </p>
              </div>
              
              {!isAddingPlayer && !editingPlayer && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowDocumentTester(true)} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FaFlask />
                    Testar Validação
                  </Button>
                  <Button onClick={() => setIsAddingPlayer(true)} className="flex items-center gap-2">
                    <FaPlus />
                    Nova Jogadora
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-hot-pink">{players.length}</div>
                <div className="text-sm text-gray-600">Total de Jogadoras</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-hot-pink">
                  {players.filter(p => p.documentPhoto && p.playerPhoto).length}
                </div>
                <div className="text-sm text-gray-600">Com Fotos Completas</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-hot-pink">
                  {players.filter(p => p.position === 'Goleira').length}
                </div>
                <div className="text-sm text-gray-600">Goleiras</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-hot-pink">
                  {players.filter(p => ['Atacante', 'Meia'].includes(p.position)).length}
                </div>
                <div className="text-sm text-gray-600">Atacantes/Meias</div>
              </div>
            </div>
          </div>

          {/* Add/Edit Player Form */}
          {(isAddingPlayer || editingPlayer) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingPlayer ? 'Editar Jogadora' : 'Cadastrar Nova Jogadora'}
              </h2>
              
              <form onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Informações Básicas</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo *
                      </label>
                      <Input
                        type="text"
                        placeholder="Nome da jogadora"
                        value={newPlayer.name}
                        onChange={handleInputChange('name')}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento *
                      </label>
                      <Input
                        type="date"
                        value={newPlayer.birthDate}
                        onChange={handleInputChange('birthDate')}
                        required
                      />
                      {newPlayer.birthDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          Idade: {calculateAge(newPlayer.birthDate)} anos
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posição *
                      </label>
                      <select
                        value={newPlayer.position}
                        onChange={handleInputChange('position')}
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        required
                      >
                        <option value="">Selecione uma posição</option>
                        {positions.map(position => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />                        <MaskedInput
                          mask="phone"
                          placeholder="(11) 99999-9999"
                          value={newPlayer.phone}
                          onChange={handleInputChange('phone')}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações de Emergência */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Contato de Emergência</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Contato
                      </label>
                      <Input
                        type="text"
                        placeholder="Nome completo"
                        value={newPlayer.emergencyContact}
                        onChange={handleInputChange('emergencyContact')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone de Emergência
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />                        <MaskedInput
                          mask="phone"
                          placeholder="(11) 99999-9999"
                          value={newPlayer.emergencyPhone}
                          onChange={handleInputChange('emergencyPhone')}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Informações Médicas
                      </label>
                      <div className="relative">
                        <FaMedkit className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                          placeholder="Alergias, medicamentos, condições médicas..."
                          value={newPlayer.medicalInfo}
                          onChange={handleInputChange('medicalInfo')}
                          className="w-full min-h-24 pl-10 pt-3 pr-3 pb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Section */}
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <FaIdCard className="text-hot-pink" />
                      Documentos Obrigatórios
                    </h3>
                    
                    <PhotoUploader
                      label="Foto do Documento (RG ou CNH)"
                      currentPhoto={newPlayer.documentPhoto}
                      onPhotoChange={(photo) => setNewPlayer(prev => ({ ...prev, documentPhoto: photo || '' }))}
                      required={true}
                      maxSizeMB={5}
                      validateDocument={true}
                      documentType="both"
                    />
                    
                    <p className="text-xs text-gray-500 mt-2">
                      * Envie uma foto clara do RG ou CNH da atleta
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <FaCamera className="text-hot-pink" />
                      Foto da Atleta
                    </h3>
                    
                    <PhotoUploader
                      label="Foto da Atleta"
                      currentPhoto={newPlayer.playerPhoto}
                      onPhotoChange={(photo) => setNewPlayer(prev => ({ ...prev, playerPhoto: photo || '' }))}
                      required={true}
                      maxSizeMB={5}
                    />
                    
                    <p className="text-xs text-gray-500 mt-2">
                      * Foto recente da atleta para identificação
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button type="submit" className="flex items-center gap-2">
                    <FaSave />
                    {editingPlayer ? 'Atualizar' : 'Cadastrar'} Jogadora
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit} className="flex items-center gap-2">
                    <FaTimes />
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Players List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Jogadoras</h2>
            
            {players.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma jogadora cadastrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece cadastrando as jogadoras do seu time para participar dos torneios.
                </p>
                {!isAddingPlayer && (
                  <Button onClick={() => setIsAddingPlayer(true)} className="flex items-center gap-2 mx-auto">
                    <FaPlus />
                    Cadastrar Primeira Jogadora
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Idade</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Posição</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Fotos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cadastro</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-hot-pink" />
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {calculateAge(player.birthDate)} anos
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-hot-pink text-white text-xs rounded-full">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-3 px-4">{player.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              player.documentPhoto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Doc: {player.documentPhoto ? '✓' : '✗'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              player.playerPhoto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Foto: {player.playerPhoto ? '✓' : '✗'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {player.registrationDate}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPlayer(player.id)}
                              className="flex items-center gap-1"
                            >
                              <FaEdit size={12} />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePlayer(player.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <FaTrash size={12} />
                              Remover
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />

        {/* Testador de Documentos */}
        {showDocumentTester && (
          <DocumentTester onClose={() => setShowDocumentTester(false)} />
        )}
        <ConfirmModal
          open={confirmOpen}
          title={confirmTitle}
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </ProtectedRoute>
  )
}

export default ManagePlayers