import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { FaCog, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-pink-light">
      <NavigationHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <FaArrowLeft />
              Voltar ao Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <FaCog className="text-2xl text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-800">
              Configurações do Admin
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <FaCog className="text-6xl text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Página em Desenvolvimento
            </h2>
            <p className="text-gray-600 max-w-md">
              Esta seção está sendo desenvolvida e estará disponível em breve. 
              As configurações administrativas serão implementadas aqui.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminSettings