# Sistema de Validação de Documentos - Copa PAB

Este sistema implementa validação automática de documentos brasileiros (RG e CNH) usando tecnologia OCR (Optical Character Recognition).

## 🎯 Funcionalidades

### ✅ Validação Automática
- **Reconhecimento de Documentos**: Identifica automaticamente se é RG ou CNH
- **Extração de Texto**: OCR com confiança mínima de 60%
- **Validação de Campos**: Verifica presença de campos obrigatórios
- **Verificação de Validade**: Para CNH, verifica se não está vencida

### 📋 Campos Validados

#### Para RG:
- ✓ Nome completo
- ✓ Número do RG
- ✓ CPF
- ✓ Data de nascimento

#### Para CNH:
- ✓ Nome completo
- ✓ Número da CNH (11 dígitos)
- ✓ CPF
- ✓ Categoria da carteira
- ✓ Data de validade

## 🔧 Como Usar

### 1. Upload de Documento
```typescript
// Exemplo de uso do PhotoUploader com validação
<PhotoUploader
  label="Foto do Documento (RG ou CNH)"
  currentPhoto={documentPhoto}
  onPhotoChange={(photo) => setDocumentPhoto(photo)}
  required={true}
  maxSizeMB={5}
  validateDocument={true}        // Habilita validação
  documentType="both"           // Aceita RG ou CNH
/>
```

### 2. Validação Manual
```typescript
import { DocumentValidator } from '../utils/documentValidator'

// Validar arquivo
const result = await DocumentValidator.validateDocument(file)

if (result.isValid) {
  console.log(`Documento ${result.documentType} válido!`)
  console.log(`Confiança: ${result.confidence}%`)
} else {
  console.log('Erros encontrados:', result.errors)
}
```

### 3. Validação Rápida
```typescript
// Verificação rápida (apenas boolean)
const isValid = await DocumentValidator.quickValidate(file)
```

## 📊 Testador de Validação

O sistema inclui um testador interativo acessível em **Gerenciar Jogadoras** > **Testar Validação**.

### Recursos do Testador:
- 📤 Upload de imagens de documentos
- 👁️ Preview da imagem enviada
- ⚡ Validação em tempo real
- 📋 Relatório detalhado dos resultados
- 📄 Exibição do texto extraído pelo OCR

## 🎚️ Configurações

### Limites de Arquivo:
- **Tamanho máximo**: 5MB por imagem
- **Formatos aceitos**: JPG, JPEG, PNG
- **Confiança mínima OCR**: 60%

### Tipos de Documento:
- `"RG"` - Apenas RG
- `"CNH"` - Apenas CNH  
- `"both"` - Aceita ambos (padrão)

## 🔍 Tecnologia

### OCR Engine:
- **Tesseract.js**: Biblioteca JavaScript de OCR
- **Idioma**: Português brasileiro (`por`)
- **Processamento**: Client-side (navegador)

### Algoritmos de Validação:
- **Padrões Regex**: Para identificar números de documentos
- **Palavras-chave**: Para classificar tipo de documento
- **Validação de Data**: Para verificar validade da CNH
- **Análise de Confiança**: Score baseado em múltiplos fatores

## ⚠️ Limitações

1. **Qualidade da Imagem**: Documentos borrados ou com baixa resolução podem falhar
2. **Iluminação**: Fotos com sombras ou reflexos podem afetar a leitura
3. **Ângulo**: Documentos fotografados em ângulos extremos podem ter baixa confiança
4. **Processamento**: OCR pode levar alguns segundos para documentos grandes

## 📱 Dicas para Melhores Resultados

### ✅ Faça:
- Use boa iluminação natural ou artificial
- Fotografe o documento plano (sem dobras)
- Mantenha o documento centralizado na foto
- Use resolução alta (mínimo 1MP)
- Limpe a lente da câmera

### ❌ Evite:
- Fotos borradas ou tremidas
- Documentos parcialmente visíveis
- Reflexos de luz na superfície do documento
- Ângulos muito inclinados
- Documentos danificados ou ilegíveis

## 🛠️ Exemplo de Integração

```typescript
import { useDocumentValidator } from '../utils/documentValidator'

function MyComponent() {
  const { validateDocument } = useDocumentValidator()
  
  const handleFileUpload = async (file: File) => {
    try {
      const result = await validateDocument(file)
      
      if (result.isValid) {
        // Documento válido - prosseguir
        console.log(`${result.documentType} validado com sucesso!`)
      } else {
        // Mostrar erros para o usuário
        alert(`Documento inválido: ${result.errors.join(', ')}`)
      }
    } catch (error) {
      console.error('Erro na validação:', error)
    }
  }
  
  return (
    // Seu componente aqui
  )
}
```

## 🎉 Resultado

O sistema de validação garante que apenas documentos brasileiros válidos sejam aceitos no cadastro de jogadoras, aumentando a confiabilidade e conformidade do sistema da Copa PAB.

---

**Nota**: Este sistema foi desenvolvido especificamente para documentos brasileiros e pode não funcionar adequadamente com documentos de outros países.