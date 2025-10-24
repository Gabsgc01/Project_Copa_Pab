import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { useAuth } from '@/contexts/AuthContext'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

const TournamentRegistration = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    additionalInfo: '',
    emergencyContact: '',
    emergencyPhone: '',
    acceptRules: false,
    acceptResponsibility: false
  })

  // Mock dos dados do torneio - em produção viria de uma API
  const tournaments = {
    '1': {
      title: 'Copa PAB Verão 2025',
      date: '15 de Março de 2025',
      location: 'Centro Esportivo Municipal - São Paulo/SP',
      maxTeams: 32,
      registeredTeams: 28,
      prize: 'R$ 10.000 para as campeãs + Troféus',
      registrationFee: 'Gratuito'
    },
    '2': {
      title: 'Torneio Revelação PAB',
      date: '22 de Abril de 2025',
      location: 'Complexo Esportivo Vila Madalena - São Paulo/SP',
      maxTeams: 16,
      registeredTeams: 8,
      prize: 'Medalhas + Material esportivo + Certificados',
      registrationFee: 'Gratuito'
    },
    '3': {
      title: 'Copa PAB Masters',
      date: '10 de Maio de 2025',
      location: 'Estádio Municipal de Guarulhos - Guarulhos/SP',
      maxTeams: 24,
      registeredTeams: 12,
      prize: 'R$ 5.000 + Troféus personalizados',
      registrationFee: 'Gratuito'
    }
  }

  const tournament = tournaments[id as keyof typeof tournaments]

  if (!tournament) {
    return (
      <div className="min-h-screen bg-pink-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Torneio não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O torneio que você está tentando acessar não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/torneios">Ver Torneios Disponíveis</Link>
          </Button>
        </div>
      </div>
    )
  }

  const spotsLeft = tournament.maxTeams - tournament.registeredTeams

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.acceptRules || !formData.acceptResponsibility) {
      alert('Você deve aceitar os regulamentos e termos de responsabilidade!')
      return
    }

    setIsSubmitting(true)

    // Simular processamento da inscrição
    setTimeout(() => {
      setIsSubmitting(false)
      alert(`Inscrição realizada com sucesso no torneio ${tournament.title}!`)
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-light">
        <NavigationHeader />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Tournament Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-hot-pink text-2xl" />
              <h1 className="text-3xl font-bold text-gray-800">Inscrição no Torneio</h1>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-hot-pink mb-4">{tournament.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-hot-pink" />
                  <span><strong>Data:</strong> {tournament.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-hot-pink" />
                  <span><strong>Local:</strong> {tournament.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-hot-pink" />
                  <span><strong>Vagas:</strong> {spotsLeft} restantes de {tournament.maxTeams}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-hot-pink" />
                  <span><strong>Premiação:</strong> {tournament.prize}</span>
                </div>
              </div>

              {spotsLeft <= 5 && spotsLeft > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-700 font-medium">
                    ⚠️ Atenção: Restam apenas {spotsLeft} vagas! Inscreva-se rapidamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Team Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Dados do Time</h3>
              
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                <div><strong>Time:</strong> {user?.teamName}</div>
                <div><strong>Responsável:</strong> {user?.responsibleName}</div>
                <div><strong>E-mail:</strong> {user?.email}</div>
                <div><strong>Telefone:</strong> {user?.phone}</div>
                <div><strong>Cidade:</strong> {user?.city}</div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                * Para alterar essas informações, acesse seu perfil no dashboard.
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Informações Adicionais</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contato de Emergência
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.emergencyContact}
                    onChange={handleInputChange('emergencyContact')}
                    required
                  />
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone de Emergência
                  </label>
                  <MaskedInput
                    mask="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange('emergencyPhone')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Informações Adicionais (opcional)
                  </label>
                  <textarea
                    placeholder="Alguma informação relevante sobre o time ou jogadoras..."
                    value={formData.additionalInfo}
                    onChange={handleInputChange('additionalInfo')}
                    className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-pink"
                    rows={3}
                  />
                </div>

                {/* Terms */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptRules"
                      checked={formData.acceptRules}
                      onChange={handleInputChange('acceptRules')}
                      className="mt-1 w-4 h-4 text-hot-pink border-gray-300 rounded focus:ring-hot-pink"
                      required
                    />
                    <label htmlFor="acceptRules" className="text-sm text-gray-600">
                      Aceito o regulamento do torneio e me comprometo a seguir todas as regras estabelecidas.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptResponsibility"
                      checked={formData.acceptResponsibility}
                      onChange={handleInputChange('acceptResponsibility')}
                      className="mt-1 w-4 h-4 text-hot-pink border-gray-300 rounded focus:ring-hot-pink"
                      required
                    />
                    <label htmlFor="acceptResponsibility" className="text-sm text-gray-600">
                      Assumo total responsabilidade por eventuais lesões ou danos durante o evento.
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-bold"
                  disabled={isSubmitting || spotsLeft === 0}
                >
                  {isSubmitting ? (
                    'Processando inscrição...'
                  ) : spotsLeft === 0 ? (
                    'Vagas Esgotadas'
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Confirmar Inscrição
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}

export default TournamentRegistration