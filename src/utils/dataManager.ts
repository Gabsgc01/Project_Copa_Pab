/**
 * Script para gerenciar dados de exemplo no localStorage
 * 
 * Para usar no console do navegador:
 * 
 * 1. Para popular com dados de exemplo:
 *    window.initializeSampleData()
 * 
 * 2. Para limpar todos os dados:
 *    window.clearAllData()
 * 
 * 3. Para adicionar mais dados:
 *    window.addMoreData()
 * 
 * 4. Para ver estatísticas atuais:
 *    window.showStats()
 */

import { populateLocalStorage, clearAllData, addMoreSampleData } from '@/utils/sampleData'

// Disponibilizar funções globalmente para uso no console
declare global {
  interface Window {
    initializeSampleData: () => void
    clearAllData: () => void
    addMoreData: () => void
    showStats: () => void
  }
}

// Função para mostrar estatísticas atuais
const showStats = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  console.group('📊 Estatísticas do LocalStorage')
  console.log(`👥 Times cadastrados: ${users.length}`)
  console.log(`🏆 Torneios criados: ${tournaments.length}`)
  console.log(`👤 Usuário logado: ${currentUser ? currentUser.name || currentUser.email : 'Nenhum'}`)
  
  if (tournaments.length > 0) {
    const published = tournaments.filter((t: any) => t.status === 'published').length
    const completed = tournaments.filter((t: any) => t.status === 'completed').length
    const draft = tournaments.filter((t: any) => t.status === 'draft').length
    
    console.log(`  📈 Publicados: ${published}`)
    console.log(`  ✅ Finalizados: ${completed}`)
    console.log(`  📝 Rascunhos: ${draft}`)
  }
  
  if (users.length > 0) {
    const totalPlayers = users.reduce((total: number, team: any) => total + (team.players?.length || 0), 0)
    console.log(`⚽ Total de jogadoras: ${totalPlayers}`)
    
    const states = [...new Set(users.map((team: any) => team.state))].filter(Boolean)
    console.log(`🗺️ Estados representados: ${states.join(', ')}`)
  }
  
  console.groupEnd()
}

// Configurar funções globais
if (typeof window !== 'undefined') {
  window.initializeSampleData = () => {
    console.log('🚀 Inicializando dados de exemplo...')
    populateLocalStorage()
    showStats()
  }
  
  window.clearAllData = () => {
    if (confirm('⚠️ Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      clearAllData()
      console.log('🗑️ Todos os dados foram removidos!')
    }
  }
  
  window.addMoreData = () => {
    console.log('➕ Adicionando mais dados...')
    addMoreSampleData()
    showStats()
  }
  
  window.showStats = showStats
  
  // Mostrar instruções no console
  console.group('🛠️ Ferramentas de Gerenciamento de Dados')
  console.log('Use as seguintes funções no console:')
  console.log('• window.initializeSampleData() - Inicializar dados de exemplo')
  console.log('• window.clearAllData() - Limpar todos os dados')
  console.log('• window.addMoreData() - Adicionar mais dados')
  console.log('• window.showStats() - Mostrar estatísticas atuais')
  console.groupEnd()
}

export { showStats }