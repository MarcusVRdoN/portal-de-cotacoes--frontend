import React from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
    <span className="ml-2 text-gray-600">Carregando...</span>
  </div>
)

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Erro</h3>
      <p className="mb-4 text-gray-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  </div>
)