import React, { useState } from 'react'
import { DocumentValidator } from '../utils/documentValidator'
import type { DocumentValidationResult } from '../utils/documentValidator'
import { Button } from './ui/button'
import { FaUpload, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'

interface DocumentTesterProps {
  onClose?: () => void
}

const DocumentTester: React.FC<DocumentTesterProps> = ({ onClose }) => {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<DocumentValidationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setValidationResult(null)

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleValidate = async () => {
    if (!selectedFile) return

    setIsValidating(true)
    setValidationResult(null)

    try {
      const result = await DocumentValidator.validateDocument(selectedFile)
      setValidationResult(result)
    } catch (error) {
      console.error('Erro na validação:', error)
      alert('Erro ao validar documento')
    } finally {
      setIsValidating(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setValidationResult(null)
    setIsValidating(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Testador de Validação de Documentos</h2>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>

          {/* Upload de arquivo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um documento (RG ou CNH)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Preview da imagem */}
          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <img
                  src={previewUrl}
                  alt="Documento selecionado"
                  className="max-w-full h-64 object-contain mx-auto"
                />
              </div>
            </div>
          )}

          {/* Botão de validação */}
          {selectedFile && (
            <div className="mb-6">
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Validando documento...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Validar Documento
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Resultado da validação */}
          {validationResult && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                {validationResult.isValid ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaExclamationTriangle className="text-red-600" />
                )}
                Resultado da Validação
              </h3>

              <div className="space-y-2">
                <p><strong>Status:</strong> 
                  <span className={validationResult.isValid ? 'text-green-600' : 'text-red-600'}>
                    {validationResult.isValid ? ' ✅ Documento Válido' : ' ❌ Documento Inválido'}
                  </span>
                </p>
                
                {validationResult.documentType && (
                  <p><strong>Tipo identificado:</strong> {validationResult.documentType}</p>
                )}
                
                <p><strong>Confiança do OCR:</strong> {Math.round(validationResult.confidence)}%</p>

                {validationResult.errors.length > 0 && (
                  <div>
                    <strong>Erros encontrados:</strong>
                    <ul className="list-disc list-inside mt-1 text-red-600">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResult.extractedText && (
                  <div className="mt-4">
                    <strong>Texto extraído (primeiras 500 palavras):</strong>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-sm max-h-32 overflow-y-auto">
                      {validationResult.extractedText.substring(0, 500)}...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Limpar
            </Button>
            {onClose && (
              <Button onClick={onClose} className="flex-1">
                Fechar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentTester