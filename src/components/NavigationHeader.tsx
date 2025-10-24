import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import { FaUser, FaSignInAlt, FaUserPlus, FaCog, FaSignOutAlt, FaChevronDown, FaHome, FaTrophy, FaUsers } from 'react-icons/fa'

const NavigationHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }



  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout()
      setShowDropdown(false)
    }
  }

  // Verifica se a rota atual é ativa
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-md border-b-2 border-hot-pink sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-hot-pink to-pink-light-1 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-base">Copa PAB</h1>
                <p className="text-sm text-gray-contrast">Futebol Feminino</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-sm font-button ${
                isActiveRoute('/') ? 'text-hot-pink font-bold' : ''
              }`}
            >
              <FaHome className="text-sm" />
              <span>Home</span>
            </Link>

            <Link 
              to="/torneios" 
              className={`flex items-center space-x-2 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-sm font-button ${
                isActiveRoute('/torneios') ? 'text-hot-pink font-bold' : ''
              }`}
            >
              <FaTrophy className="text-sm" />
              <span>Torneios</span>
            </Link>

            <Link 
              to="/chaveamentos" 
              className={`flex items-center space-x-2 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-sm font-button ${
                isActiveRoute('/chaveamentos') ? 'text-hot-pink font-bold' : ''
              }`}
            >
              <FaTrophy className="text-sm" />
              <span>Chaveamentos</span>
            </Link>

            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-2 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-sm font-button ${
                    isActiveRoute('/dashboard') ? 'text-hot-pink font-bold' : ''
                  }`}
                >
                  <FaCog className="text-sm" />
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/jogadoras" 
                  className={`flex items-center space-x-2 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-sm font-button ${
                    isActiveRoute('/jogadoras') ? 'text-hot-pink font-bold' : ''
                  }`}
                >
                  <FaUsers className="text-sm" />
                  <span>Jogadoras</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              /* Usuário Logado */
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-hot-pink hover:bg-pink-light transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-hot-pink to-pink-light-1 rounded-full flex items-center justify-center shadow-sm">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-gray-base">{user.teamName}</p>
                      <p className="text-xs text-gray-contrast">{user.responsibleName}</p>
                    </div>
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
                    
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-lg shadow-lg border-2 border-pink-light py-3 z-20">
                      <div className="px-4 py-3 border-b border-pink-light bg-pink-light rounded-t-lg">
                        <p className="text-sm font-bold text-gray-base">{user.teamName}</p>
                        <p className="text-xs text-gray-contrast">{user.responsibleName}</p>
                        <p className="text-xs text-gray-contrast">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="w-full block px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors font-button"
                        >
                          <div className="flex items-center space-x-3">
                            <FaCog className="text-hot-pink w-4 h-4" />
                            <span className="font-medium">Dashboard</span>
                          </div>
                        </Link>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="w-full block px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors font-button"
                        >
                          <div className="flex items-center space-x-3">
                            <FaUser className="text-hot-pink w-4 h-4" />
                            <span className="font-medium">Meu Perfil</span>
                          </div>
                        </Link>

                        <Link
                          to="/jogadoras"
                          onClick={() => setShowDropdown(false)}
                          className="w-full block px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors font-button"
                        >
                          <div className="flex items-center space-x-3">
                            <FaUsers className="text-hot-pink w-4 h-4" />
                            <span className="font-medium">Gerenciar Jogadoras</span>
                          </div>
                        </Link>


                      </div>
                      
                      {isAdmin && (
                        <>
                          <hr className="my-2 border-pink-light" />
                          
                          <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Administração
                            </p>
                          </div>
                          
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="w-full block px-4 py-3 text-left text-sm text-gray-contrast hover:bg-pink-light hover:text-hot-pink transition-colors font-button"
                          >
                            <div className="flex items-center space-x-3">
                              <FaCog className="text-purple-500 w-4 h-4" />
                              <span className="font-medium">Painel Admin</span>
                            </div>
                          </Link>
                        </>
                      )}
                      
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
                  className="flex items-center space-x-2 border-2 border-gray-contrast text-gray-contrast hover:border-hot-pink hover:text-hot-pink hover:bg-pink-light transition-all font-button"
                >
                  <FaSignInAlt className="text-sm" />
                  <span>Entrar</span>
                </Button>
                
                <Button
                  variant="gradient"
                  onClick={handleRegister}
                  className="flex items-center space-x-2 shadow-md font-button"
                >
                  <FaUserPlus className="text-sm" />
                  <span>Cadastrar</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex items-center justify-center space-x-6 border-t border-pink-light pt-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-xs font-button ${
              isActiveRoute('/') ? 'text-hot-pink font-bold' : ''
            }`}
          >
            <FaHome className="text-sm" />
            <span>Home</span>
          </Link>

          <Link 
            to="/torneios" 
            className={`flex items-center space-x-1 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-xs font-button ${
              isActiveRoute('/torneios') ? 'text-hot-pink font-bold' : ''
            }`}
          >
            <FaTrophy className="text-sm" />
            <span>Torneios</span>
          </Link>

          {user && (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-xs font-button ${
                  isActiveRoute('/dashboard') ? 'text-hot-pink font-bold' : ''
                }`}
              >
                <FaCog className="text-sm" />
                <span>Dashboard</span>
              </Link>

              <Link 
                to="/jogadoras" 
                className={`flex items-center space-x-1 text-gray-contrast hover:text-hot-pink transition-colors font-medium text-xs font-button ${
                  isActiveRoute('/jogadoras') ? 'text-hot-pink font-bold' : ''
                }`}
              >
                <FaUsers className="text-sm" />
                <span>Jogadoras</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default NavigationHeader