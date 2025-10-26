/**
 * Utilitários seguros para manipulação de strings e dados de usuário
 */

/**
 * Obtém a primeira letra de uma string de forma segura
 * @param text - Texto para extrair a primeira letra
 * @param fallback - Valor padrão se o texto for inválido
 * @returns Primeira letra em maiúsculo ou fallback
 */
export const getSafeInitial = (text: string | null | undefined, fallback: string = 'T'): string => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return fallback.charAt(0).toUpperCase()
  }
  return text.trim().charAt(0).toUpperCase()
}

/**
 * Obtém o nome do time de forma segura
 * @param user - Objeto do usuário
 * @returns Nome do time ou fallback
 */
export const getSafeTeamName = (user: any): string => {
  return user?.teamName || user?.name || 'Time'
}

/**
 * Obtém o nome do responsável de forma segura
 * @param user - Objeto do usuário
 * @returns Nome do responsável ou fallback
 */
export const getSafeResponsibleName = (user: any): string => {
  return user?.responsibleName || user?.captain || 'Responsável'
}

/**
 * Valida se um usuário tem as propriedades mínimas necessárias
 * @param user - Objeto do usuário
 * @returns true se o usuário é válido
 */
export const isValidUser = (user: any): boolean => {
  return user && user.id && (user.teamName || user.name)
}

/**
 * Formata data de forma segura
 * @param date - String da data
 * @returns Data formatada ou mensagem padrão
 */
export const getSafeDate = (date: string | null | undefined): string => {
  if (!date) return 'Data não informada'
  
  try {
    return new Date(date).toLocaleDateString('pt-BR')
  } catch {
    return 'Data inválida'
  }
}