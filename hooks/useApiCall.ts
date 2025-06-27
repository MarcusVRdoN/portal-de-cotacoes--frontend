import { useState } from 'react'

export const useApiCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callApi = async (apiFunction: () => Promise<any>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, callApi, clearError: () => setError(null) }
}