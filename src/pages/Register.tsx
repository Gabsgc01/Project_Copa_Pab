import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaUser, FaUsers, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    teamName: '',
    responsibleName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (!formData.acceptTerms) {
      alert('Você deve aceitar os termos e condições!')
      return
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }
    
    setIsLoading(true)
    
    const result = await register({
      teamName: formData.teamName,
      responsibleName: formData.responsibleName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      password: formData.password
    })
    
    setIsLoading(false)
    
    if (result.success) {
      alert(result.message)
      navigate('/dashboard') // Redireciona para o dashboard após o cadastro
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-pink-light flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-hot-pink">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-800 hover:text-hot-pink transition-colors">
              ← Copa PAB
            </Link>
            <Link to="/login" className="text-hot-pink hover:underline font-medium">
              Já tem conta? Fazer login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            CADASTRO
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Crie sua conta e inscreva seu time na Copa PAB
          </p>
          
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Informações do Time */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <FaUsers className="text-hot-pink" />
                Informações do Time
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Time *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Furacão Rosa FC"
                    value={formData.teamName}
                    onChange={handleInputChange('teamName')}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade do Time *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Ex: São Paulo - SP"
                      value={formData.city}
                      onChange={handleInputChange('city')}
                      className="w-full pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Responsável */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                <FaUser className="text-hot-pink" />
                Responsável pelo Time
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.responsibleName}
                    onChange={handleInputChange('responsibleName')}
                    className="w-full"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <MaskedInput
                        type="email"
                        mask="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        className="w-full pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <MaskedInput
                        type="tel"
                        mask="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        className="w-full pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Criar Senha
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Criar senha..."
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      className="w-full pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar senha..."
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      className="w-full pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                * A senha deve ter pelo menos 6 caracteres
              </p>
            </div>

            {/* Termos e Condições */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                className="mt-1 w-4 h-4 text-hot-pink border-gray-300 rounded focus:ring-hot-pink"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                Eu aceito os{' '}
                <Link to="/termos" className="text-hot-pink hover:underline">
                  termos e condições
                </Link>
                {' '}e{' '}
                <Link to="/privacidade" className="text-hot-pink hover:underline">
                  política de privacidade
                </Link>
                {' '}da Copa PAB *
              </label>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Button>

              <div className="text-center">
                <span className="text-gray-600">Já tem uma conta? </span>
                <Link to="/login" className="text-hot-pink hover:underline font-medium">
                  Fazer login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Register