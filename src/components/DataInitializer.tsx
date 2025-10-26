import { useEffect } from 'react'
import { populateLocalStorage } from '@/utils/sampleData'

// Componente para inicializar dados de exemplo
const DataInitializer = () => {
  useEffect(() => {
    // Forçar atualização para corrigir problemas de estrutura de dados
    const currentVersion = '2.0' // Incrementar esta versão quando houver mudanças estruturais
    const lastVersion = localStorage.getItem('dataVersion')
    
    if (!lastVersion || lastVersion !== currentVersion) {
      console.log('🚀 Atualizando estrutura de dados para versão', currentVersion)
      
      // Limpar dados antigos que podem ter estrutura incorreta
      localStorage.removeItem('users')
      localStorage.removeItem('tournaments')
      localStorage.removeItem('dashboardStats')
      
      // Carregar novos dados com estrutura correta
      populateLocalStorage()
      localStorage.setItem('dataVersion', currentVersion)
      localStorage.setItem('dataInitialized', 'true')
      console.log('✅ Dados atualizados com sucesso para versão', currentVersion)
    } else {
      console.log('ℹ️ Dados já estão na versão correta:', currentVersion)
    }
  }, [])

  return null // Este componente não renderiza nada
}

export default DataInitializer