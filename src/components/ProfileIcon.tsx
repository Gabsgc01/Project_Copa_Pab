import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { FaUser, FaSignInAlt, FaUserPlus, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa'

const ProfileIcon = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogin = () => {
    navigate('/login')
  }
  const handleRegister = () => {
    navigate('/cadastrar')
  }

  const handleProfile = () => {
    navigate('/profile')
    setShowDropdown(false)
  }

  const handleDashboard = () => {
    navigate('/dashboard')
    setShowDropdown(false)
  }

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout()
      setShowDropdown(false)
    }
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      {user ? (
        /* Usuário Logado */
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border-2 border-white hover:border-hot-pink hover:bg-white transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-hot-pink to-pink-light-1 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div className="hidden sm:block text-left pr-2">
              <p className="text-sm font-bold text-gray-base">{user.teamName}</p>
              <p className="text-xs text-gray-contrast">{user.responsibleName}</p>
            </div>
            <FaChevronDown className={`text-gray-contrast text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Overlay para fechar dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-lg shadow-xl border-2 border-pink-light py-3 z-20">
                <div className="px-4 py-3 border-b border-pink-light bg-pink-light rounded-t-lg">
                  <p className="text-sm font-bold text-gray-base">{user.teamName}</p>
                  <p className="text-xs text-gray-contrast">{user.responsibleName}</p>
                  <p className="text-xs text-gray-contrast">{user.email}</p>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={handleDashboard}
                    className="w-full px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors flex items-center space-x-3 font-button"
                  >
                    <FaCog className="text-hot-pink w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </button>
                  
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors flex items-center space-x-3 font-button"
                  >
                    <FaUser className="text-hot-pink w-4 h-4" />
                    <span className="font-medium">Meu Perfil</span>
                  </button>
                </div>
                
                <hr className="my-2 border-pink-light" />
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3 font-button"
                >
                  <FaSignOutAlt className="text-red-500 w-4 h-4" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Usuário Não Logado */
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleLogin}
            className="bg-white/90 backdrop-blur-sm border-2 border-gray-contrast text-gray-contrast hover:border-hot-pink hover:text-hot-pink hover:bg-white transition-all font-button shadow-lg"
          >
            <FaSignInAlt className="text-sm mr-2" />
            <span>Entrar</span>
          </Button>
          
          <Button
            variant="gradient"
            onClick={handleRegister}
            className="shadow-lg font-button backdrop-blur-sm"
          >
            <FaUserPlus className="text-sm mr-2" />
            <span>Cadastrar</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProfileIcon