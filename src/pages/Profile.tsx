import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaUser, FaEdit, FaSave, FaTimes, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaShieldAlt } from 'react-icons/fa'
import { formatDateBR } from '@/utils/timeUtils'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    teamName: user?.teamName || '',
    responsibleName: user?.responsibleName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    foundationYear: user?.foundationYear || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!editData.teamName || !editData.responsibleName || !editData.email) {
      alert('Preencha os campos obrigatórios!')
      return
    }

    // Validação de senha se estiver alterando
    if (editData.newPassword || editData.confirmPassword) {
      if (!editData.currentPassword) {
        alert('Digite a senha atual para alterá-la')
        return
      }
      
      if (editData.currentPassword !== user?.password) {
        alert('Senha atual incorreta')
        return
      }
      
      if (editData.newPassword !== editData.confirmPassword) {
        alert('Nova senha e confirmação não coincidem')
        return
      }
      
      if (editData.newPassword.length < 6) {
        alert('Nova senha deve ter pelo menos 6 caracteres')
        return
      }
    }

    // Atualizar dados
    const updatedUser = {
      ...user!,
      teamName: editData.teamName,
      responsibleName: editData.responsibleName,
      email: editData.email,
      phone: editData.phone,
      city: editData.city,
      foundationYear: editData.foundationYear,
      ...(editData.newPassword && { password: editData.newPassword })
    }

    updateUser(updatedUser)
    setIsEditing(false)
    setEditData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    alert('Perfil atualizado com sucesso!')
  }

  const handleCancel = () => {
    setEditData({
      teamName: user?.teamName || '',
      responsibleName: user?.responsibleName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      foundationYear: user?.foundationYear || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header do Perfil */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-hot-pink to-pink-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{user.teamName}</h1>
                  <p className="text-gray-600">Responsável: {user.responsibleName}</p>
                  <p className="text-sm text-gray-500">Membro desde {formatDateBR(user.registrationDate)}</p>
                </div>
              </div>
              
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <FaEdit />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>

          {/* Informações do Time */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaUsers className="text-hot-pink" />
              Informações do Time
            </h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Time *
                    </label>
                    <Input
                      value={editData.teamName}
                      onChange={handleInputChange('teamName')}
                      placeholder="Digite o nome do time"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável *
                    </label>
                    <Input
                      value={editData.responsibleName}
                      onChange={handleInputChange('responsibleName')}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={editData.email}
                      onChange={handleInputChange('email')}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <MaskedInput
                      mask="phone"
                      value={editData.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <Input
                      value={editData.city}
                      onChange={handleInputChange('city')}
                      placeholder="Cidade do time"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ano de Fundação
                    </label>
                    <Input
                      type="number"
                      value={editData.foundationYear}
                      onChange={handleInputChange('foundationYear')}
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                {/* Alteração de Senha */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-hot-pink" />
                    Alterar Senha (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </label>
                      <Input
                        type="password"
                        value={editData.currentPassword}
                        onChange={handleInputChange('currentPassword')}
                        placeholder="Senha atual"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <Input
                        type="password"
                        value={editData.newPassword}
                        onChange={handleInputChange('newPassword')}
                        placeholder="Nova senha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <Input
                        type="password"
                        value={editData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button type="submit" className="flex items-center gap-2">
                    <FaSave />
                    Salvar Alterações
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                    <FaTimes />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nome do Time</p>
                      <p className="font-medium text-gray-900">{user.teamName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Responsável</p>
                      <p className="font-medium text-gray-900">{user.responsibleName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.city && (
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Cidade</p>
                        <p className="font-medium text-gray-900">{user.city}</p>
                      </div>
                    </div>
                  )}

                  {user.foundationYear && (
                    <div className="flex items-center gap-3">
                      <FaCalendar className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Fundado em</p>
                        <p className="font-medium text-gray-900">{user.foundationYear}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Estatísticas */}
          {!isEditing && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Estatísticas do Time</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-hot-pink">
                    {user.players?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Jogadoras Cadastradas</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-hot-pink">
                    {user.players?.filter(p => p.documentPhoto && p.playerPhoto).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Com Documentos</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-hot-pink">
                    {Math.round(((new Date().getTime() - new Date(user.registrationDate).getTime()) / (1000 * 3600 * 24)) || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Dias Cadastrado</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-hot-pink">
                    {user.players?.filter(p => p.position === 'Goleira').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Goleiras</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}

export default Profile