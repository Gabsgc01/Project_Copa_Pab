import * as React from "react"
import { cn } from "@/lib/utils"

export interface MaskedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: 'phone' | 'email' | 'number' | 'text'
  maxLength?: number
  disableTrim?: boolean
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, type, mask, maxLength, onChange, value, disableTrim = true, ...props }, ref) => {
      const formatPhone = (value: string) => {
      // Remove todos os caracteres não numéricos
      const numbers = value.replace(/\D/g, '')
      // Limita a 11 dígitos (DDD + 9 dígitos)
      const limitedNumbers = numbers.slice(0, 11)
      
      // Formata: (XX) XXXXX-XXXX
      if (limitedNumbers.length <= 2) {
        return limitedNumbers
      } else if (limitedNumbers.length <= 7) {
        return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
      } else {
        return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`
      }
    }

    const formatEmail = (value: string) => {
      // Remove espaços e caracteres não permitidos em emails
      return value.toLowerCase().replace(/[^a-z0-9@._-]/g, '')
    }

    const formatNumber = (value: string) => {
      // Permitir apenas números
      return value.replace(/[^0-9]/g, '')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let formattedValue = disableTrim ? e.target.value : e.target.value.trim()

      switch (mask) {
        case 'phone':
          formattedValue = formatPhone(formattedValue)
          break
        case 'email':
          formattedValue = formatEmail(formattedValue)
          break
        case 'number':
          formattedValue = formatNumber(formattedValue)
          break
        case 'text':
          formattedValue = disableTrim ? formattedValue : formattedValue.trim()
          break
        default:
          formattedValue = disableTrim ? formattedValue : formattedValue.trim()
      }

      if (maxLength && formattedValue.length > maxLength) {
        formattedValue = formattedValue.slice(0, maxLength)
      }

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue
        }
      }

      onChange?.(syntheticEvent)
    }

    return (
      <input
        type={mask === 'email' ? 'email' : mask === 'number' ? 'text' : type || 'text'}
        className={cn(
          "flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        value={value}
        maxLength={mask === 'phone' ? 15 : maxLength}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = "MaskedInput"

export { MaskedInput }
