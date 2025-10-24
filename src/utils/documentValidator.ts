import Tesseract from 'tesseract.js';

export interface DocumentValidationResult {
  isValid: boolean;
  documentType: 'RG' | 'CNH' | null;
  extractedText: string;
  confidence: number;
  errors: string[];
}

/**
 * Valida documentos brasileiros (RG e CNH) usando OCR
 */
export class DocumentValidator {
  private static readonly RG_PATTERNS = [
    /\b\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}\b/g, // Formato: XX.XXX.XXX-X
    /\b\d{7,9}-?\d{1}\b/g, // Formato: XXXXXXX-X ou XXXXXXXXX-X
    /registro\s*geral/gi,
    /identidade/gi,
    /r\.?g\.?\s*n[ºo°]/gi
  ];

  private static readonly CNH_PATTERNS = [
    /\b\d{11}\b/g, // CNH tem 11 dígitos
    /carteira\s*nacional\s*de\s*habilitação/gi,
    /c\.?n\.?h\.?\s*n[ºo°]/gi,
    /categoria/gi,
    /válida\s*até/gi,
    /validade/gi
  ];

  private static readonly REQUIRED_FIELDS = {
    RG: ['nome', 'rg', 'cpf', 'nascimento'],
    CNH: ['nome', 'cnh', 'cpf', 'categoria', 'validade']
  };

  /**
   * Processa imagem e extrai texto usando OCR
   */
  private static async extractText(imageFile: File): Promise<{ text: string; confidence: number }> {
    try {
      const result = await Tesseract.recognize(imageFile, 'por', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence
      };
    } catch (error) {
      throw new Error(`Erro no OCR: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Identifica o tipo de documento baseado no texto extraído
   */
  private static identifyDocumentType(text: string): 'RG' | 'CNH' | null {
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

    // Conta matches para cada tipo
    const rgMatches = this.RG_PATTERNS.reduce((count, pattern) => {
      const matches = normalizedText.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);

    const cnhMatches = this.CNH_PATTERNS.reduce((count, pattern) => {
      const matches = normalizedText.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);

    // Verifica palavras-chave específicas
    const hasRgKeywords = /registro\s*geral|identidade/gi.test(normalizedText);
    const hasCnhKeywords = /carteira.*habilitação|categoria.*[abcd]/gi.test(normalizedText);

    if (hasCnhKeywords || cnhMatches > rgMatches) {
      return 'CNH';
    } else if (hasRgKeywords || rgMatches > 0) {
      return 'RG';
    }

    return null;
  }

  /**
   * Valida campos obrigatórios do documento
   */
  private static validateRequiredFields(text: string, documentType: 'RG' | 'CNH'): string[] {
    const errors: string[] = [];
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
    const requiredFields = this.REQUIRED_FIELDS[documentType];

    // Validações específicas para cada campo
    const validations = {
      nome: /([a-záàâãéèêíïóôõöúçñ]{2,}\s*){2,}/gi,
      rg: /\b\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}\b/g,
      cnh: /\b\d{11}\b/g,
      cpf: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
      nascimento: /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}\b/g,
      categoria: /categoria\s*[:\-]?\s*[abcd]/gi,
      validade: /válida?\s*até|validade/gi
    };

    requiredFields.forEach(field => {
      const pattern = validations[field as keyof typeof validations];
      if (pattern && !pattern.test(normalizedText)) {
        errors.push(`Campo obrigatório não encontrado: ${field.toUpperCase()}`);
      }
    });

    return errors;
  }

  /**
   * Valida se a CNH não está vencida
   */
  private static validateCNHExpiry(text: string): string[] {
    const errors: string[] = [];
    const datePattern = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}\b/g;
    const dates = text.match(datePattern);

    if (dates && dates.length > 0) {
      const today = new Date();
      const possibleExpiryDates = dates.map(dateStr => {
        const [day, month, year] = dateStr.split(/[\/\-\.]/).map(Number);
        return new Date(year, month - 1, day);
      });

      const validDates = possibleExpiryDates.filter(date => date > today);
      
      if (validDates.length === 0) {
        errors.push('CNH parece estar vencida');
      }
    } else {
      errors.push('Data de validade da CNH não encontrada');
    }

    return errors;
  }

  /**
   * Função principal de validação de documentos
   */
  static async validateDocument(imageFile: File): Promise<DocumentValidationResult> {
    const result: DocumentValidationResult = {
      isValid: false,
      documentType: null,
      extractedText: '',
      confidence: 0,
      errors: []
    };

    try {
      // Validação inicial do arquivo
      if (!imageFile.type.startsWith('image/')) {
        result.errors.push('Arquivo deve ser uma imagem');
        return result;
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        result.errors.push('Imagem muito grande (máximo 5MB)');
        return result;
      }

      // Extração de texto com OCR
      console.log('Iniciando OCR do documento...');
      const { text, confidence } = await this.extractText(imageFile);
      
      result.extractedText = text;
      result.confidence = confidence;

      if (confidence < 60) {
        result.errors.push('Qualidade da imagem muito baixa para leitura (confiança < 60%)');
        return result;
      }

      // Identificação do tipo de documento
      result.documentType = this.identifyDocumentType(text);
      
      if (!result.documentType) {
        result.errors.push('Não foi possível identificar o tipo de documento (RG ou CNH)');
        return result;
      }

      // Validação de campos obrigatórios
      const fieldErrors = this.validateRequiredFields(text, result.documentType);
      result.errors.push(...fieldErrors);

      // Validação específica para CNH
      if (result.documentType === 'CNH') {
        const expiryErrors = this.validateCNHExpiry(text);
        result.errors.push(...expiryErrors);
      }

      // Documento é válido se não há erros
      result.isValid = result.errors.length === 0;

      return result;

    } catch (error) {
      result.errors.push(`Erro durante validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      return result;
    }
  }

  /**
   * Validação rápida apenas para verificar se é um documento válido
   */
  static async quickValidate(imageFile: File): Promise<boolean> {
    try {
      const result = await this.validateDocument(imageFile);
      return result.isValid && result.confidence > 70;
    } catch {
      return false;
    }
  }
}

/**
 * Hook personalizado para usar o validador de documentos
 */
export const useDocumentValidator = () => {
  return {
    validateDocument: DocumentValidator.validateDocument,
    quickValidate: DocumentValidator.quickValidate
  };
};