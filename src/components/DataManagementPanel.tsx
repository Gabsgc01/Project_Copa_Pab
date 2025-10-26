import { useState } from 'react'
import { populateLocalStorage, clearAllData } from '@/utils/sampleData'
import { Button } from '@/components/ui/button'
import { FaDatabase, FaTrash, FaRedo } from 'react-icons/fa'

const DataManagementPanel = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handlePopulateData = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      populateLocalStorage()
      setMessage('✅ Dados de exemplo carregados com sucesso!')
      
      // Recarregar a página para atualizar todos os contextos
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage('❌ Erro ao carregar dados de exemplo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm('⚠️ Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      clearAllData()
      setMessage('🗑️ Todos os dados foram removidos!')
      
      // Recarregar a página para atualizar todos os contextos
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setMessage('❌ Erro ao limpar dados')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshData = () => {
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaDatabase className="text-indigo-600" />
        Gerenciamento de Dados
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        Use as opções abaixo para gerenciar os dados de exemplo do sistema. 
        Ideal para testes e demonstrações.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handlePopulateData}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <FaDatabase className="text-sm" />
          {loading ? 'Carregando...' : 'Carregar Dados de Exemplo'}
        </Button>

        <Button
          onClick={handleClearData}
          disabled={loading}
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <FaTrash className="text-sm" />
          Limpar Todos os Dados
        </Button>

        <Button
          onClick={handleRefreshData}
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
        >
          <FaRedo className="text-sm" />
          Atualizar Página
        </Button>
      </div>

      {message && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>💡 Dica:</strong> Use o console do navegador para mais opções avançadas. 
          Digite <code className="bg-white px-1 py-0.5 rounded">window.showStats()</code> para ver estatísticas detalhadas.
        </p>
      </div>
    </div>
  )
}

export default DataManagementPanel