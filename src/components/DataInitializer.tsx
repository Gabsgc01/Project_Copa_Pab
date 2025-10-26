import { useEffect } from 'react'
import { populateLocalStorage } from '@/utils/sampleData'

// Componente para inicializar dados de exemplo
const DataInitializer = () => {
  useEffect(() => {
    // Executar apenas uma vez quando o app carrega
    const hasInitialized = localStorage.getItem('dataInitialized')
    
    if (!hasInitialized) {
      console.log('🚀 Inicializando dados de exemplo...')
      populateLocalStorage()
      localStorage.setItem('dataInitialized', 'true')
      console.log('✅ Dados de exemplo inicializados com sucesso!')
    } else {
      console.log('ℹ️ Dados já foram inicializados anteriormente')
    }
  }, [])

  return null // Este componente não renderiza nada
}

export default DataInitializer