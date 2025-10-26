import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useState } from 'react'

interface AuthHeaderProps {
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  showBackButton = true, 
  backTo = "/", 
  backLabel = "← Copa PAB" 
}) => {
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogout = () => {
    openConfirm({
      message: 'Tem certeza que deseja sair?',
      onConfirm: () => logout()
    })
  }

  // Modal state
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

  return (
    <div className="bg-white shadow-sm border-b-2 border-hot-pink">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {showBackButton && (
            <Link to={backTo} className="text-xl font-bold text-gray-800 hover:text-hot-pink transition-colors">
              {backLabel}
            </Link>
          )}
          
          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="text-hot-pink" />
                  <div className="text-sm">
                    <div className="font-medium">{user.responsibleName}</div>
                    <div className="text-gray-500">{user.teamName}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-hot-pink hover:underline font-medium">
                  Fazer login
                </Link>
                <Link to="/cadastrar">
                  <Button variant="default" size="sm">
                    Cadastrar-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

export default AuthHeader