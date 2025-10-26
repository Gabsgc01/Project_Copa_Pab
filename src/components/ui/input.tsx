import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  disableTrim?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, onBlur, disableTrim = true, ...props }, ref) => {
    // Não remover espaços automaticamente enquanto o usuário digita.
    // Se o desenvolvedor quiser que o campo seja "trimado", mantenha disableTrim={false} —
    // nesse caso aplicamos o trim apenas no onBlur para evitar comportamento estranho ao digitar.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Primeiro repassa o onBlur padrão, se houver
      onBlur?.(e)

      // Se trim estiver habilitado (disableTrim === false), aplicamos trim no blur
      if (!disableTrim && onChange) {
        const trimmedValue = (e.target as HTMLInputElement).value.trim()
        const syntheticEvent = {
          // Use any para contornar diferença de tipos entre FocusEvent e ChangeEvent
          ...e,
          target: {
            ...(e.target as HTMLInputElement),
            value: trimmedValue
          }
        } as any

        onChange(syntheticEvent)
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }