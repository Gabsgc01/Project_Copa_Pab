import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import Title from '@/components/Title'
import Footer from '@/components/Footer'
import { FaShieldAlt, FaUser, FaLock, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim()) {
      setError('Por favor, insira o nome de usuário')
      return
    }
    
    if (!password.trim()) {
      setError('Por favor, insira a senha')
      return
    }

    setLoading(true)
    
    try {
      const result = await adminLogin(username, password)
      
      if (result.success) {
        navigate('/admin/dashboard')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.')
      console.error('Erro no login administrativo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hot-pink to-pink-light flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <Title className="text-white mb-2">
              Acesso Administrativo
            </Title>
            <p className="text-pink-light text-lg">
              Painel de Controle Copa PAB
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário Administrativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hot-pink focus:border-hot-pink text-sm"
                    placeholder="Digite o usuário administrativo"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Administrativa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hot-pink focus:border-hot-pink text-sm"
                    placeholder="Digite a senha administrativa"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Acessar Painel Administrativo'}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <FaShieldAlt className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-3 text-sm text-blue-700">
                  <p className="font-medium">Acesso Restrito</p>
                  <p className="mt-1">
                    Esta área é destinada exclusivamente para administradores autorizados.
                    Todas as ações são monitoradas e registradas.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-hot-pink transition-colors"
              >
                <FaHome className="mr-2" />
                Voltar ao site principal
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg text-center">
            <p className="text-white text-sm font-medium mb-2">Credenciais de Demonstração:</p>
            <p className="text-pink-light text-xs">
              <strong>Usuário:</strong> admin_copa_pab<br />
              <strong>Senha:</strong> Copa@PAB2025!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminLogin