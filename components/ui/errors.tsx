import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Erro ao carregar dados
        </h3>
        <p className="mb-4 text-gray-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-white rounded bg-primary hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}