import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!teamName || !password) {
      alert('Por favor, preencha todos os campos!')
      return
    }
    
    setIsLoading(true)
    
    const result = await login(teamName, password)
    
    setIsLoading(false)
    
    if (result.success) {
      alert(result.message)
      navigate('/dashboard') // Redireciona para o dashboard após o login
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-pink-light flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            LOGIN
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Nome do Time"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="text-left">
              <Link 
                to="/esqueci-senha" 
                className="text-gray-600 hover:text-hot-pink transition-colors underline text-sm"
              >
                Esqueci a senha
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Button 
              type="button" 
              className="w-full h-12 text-lg font-bold"
              variant="default"
              asChild
            >
              <Link to="/cadastrar">
                Cadastrar-se
              </Link>
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Login