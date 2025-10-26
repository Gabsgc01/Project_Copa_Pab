import { useState, useRef } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Button } from './ui/button'
import { FaCamera, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import { DocumentValidator } from '../utils/documentValidator'
import type { DocumentValidationResult } from '../utils/documentValidator'

interface PhotoUploaderProps {
  label: string
  currentPhoto?: string
  onPhotoChange: (photo: string | null) => void
  required?: boolean
  acceptedFormats?: string
  maxSizeMB?: number
  validateDocument?: boolean
  documentType?: 'RG' | 'CNH' | 'both'
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  label,
  currentPhoto,
  onPhotoChange,
  required = false,
  acceptedFormats = "image/jpeg,image/jpg,image/png",
  maxSizeMB = 5,
  validateDocument = false,
  documentType = 'both'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [validationResult, setValidationResult] = useState<DocumentValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
      return
    }

    // Validar tipo do arquivo
    if (!acceptedFormats.split(',').includes(file.type)) {
      alert('Formato não suportado. Use JPG, JPEG ou PNG.')
      return
    }

    setIsLoading(true)
    setValidationResult(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setPreviewUrl(base64)
      
      // Se validação de documento está habilitada, validar
      if (validateDocument) {
        setIsValidating(true)
        try {
          const validation = await DocumentValidator.validateDocument(file)
          setValidationResult(validation)
          
          // Verificar se o tipo do documento está correto
          if (validation.isValid && documentType !== 'both') {
            if (validation.documentType !== documentType) {
              alert(`Documento inválido. Esperado: ${documentType}, encontrado: ${validation.documentType}`)
              setPreviewUrl(null)
              setIsLoading(false)
              setIsValidating(false)
              return
            }
          }
          
          // Se documento não é válido, mostrar erros
          if (!validation.isValid) {
            const errorMessage = `Documento inválido:\n${validation.errors.join('\n')}`
            alert(errorMessage)
            setPreviewUrl(null)
            setIsLoading(false)
            setIsValidating(false)
            return
          }
          
        } catch (error) {
          console.error('Erro na validação do documento:', error)
          alert('Erro ao validar documento. Tente novamente.')
          setPreviewUrl(null)
          setIsLoading(false)
          setIsValidating(false)
          return
        }
        setIsValidating(false)
      }
      
      onPhotoChange(base64)
      setIsLoading(false)
    }
    
    reader.onerror = () => {
      alert('Erro ao carregar a imagem')
      setIsLoading(false)
      setIsValidating(false)
    }
    
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    openConfirm({
      message: 'Tem certeza que deseja remover esta foto?',
      onConfirm: () => {
        setPreviewUrl(null)
        onPhotoChange(null)
        setValidationResult(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
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

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview area */}
      {previewUrl ? (
        <div className="relative">
          <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            <img 
              src={previewUrl} 
              alt={label} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Status de validação */}
          {validateDocument && (
            <div className="mt-2">
              {isValidating ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <FaSpinner className="animate-spin" size={12} />
                  <span className="text-sm">Validando documento...</span>
                </div>
              ) : validationResult ? (
                <div className={`flex items-center gap-2 ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validationResult.isValid ? (
                    <FaCheckCircle size={12} />
                  ) : (
                    <FaExclamationTriangle size={12} />
                  )}
                  <span className="text-sm">
                    {validationResult.isValid 
                      ? `${validationResult.documentType} válido (${Math.round(validationResult.confidence)}% confiança)`
                      : `Documento inválido: ${validationResult.errors[0]}`
                    }
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <FaEye size={12} />
              Ver
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleButtonClick}
              className="flex items-center gap-2"
            >
              <FaCamera size={12} />
              Alterar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRemovePhoto}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <FaTrash size={12} />
              Remover
            </Button>
          </div>
        </div>
      ) : (
        /* Upload area */
        <div 
          onClick={handleButtonClick}
          className="w-full h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          {isLoading || isValidating ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-2xl text-hot-pink mb-2" />
              <span className="text-sm text-gray-500">
                {isValidating ? 'Validando documento...' : 'Carregando...'}
              </span>
            </div>
          ) : (
            <>
              <FaCamera className="text-2xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center px-2">
                Clique para adicionar {label.toLowerCase()}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                JPG, PNG até {maxSizeMB}MB
              </span>
            </>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={previewUrl} 
              alt={label} 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2"
              variant="outline"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

export default PhotoUploader