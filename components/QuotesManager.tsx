import React, { useState, useEffect } from 'react'
import { Plus, FileText, Eye, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { LoadingSpinner, ErrorMessage } from './LoadingAndError'
import { useApiCall } from '../hooks/useApiCall'
import { apiService } from '../services/apiService'
import { User, Quote } from '../types'

interface QuotesManagerProps {
  user: User
}

const QuotesManager: React.FC<QuotesManagerProps> = ({ user }) => {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)
  const [newQuote, setNewQuote] = useState({ observacoes: '' })
  const { loading, error, callApi } = useApiCall()

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    try {
      await callApi(async () => {
        const token = String(localStorage.getItem('auth_token'))
        const response = await apiService.getQuotes(token)
        setQuotes(response.cotacoes)
      })
    } catch (err) {
      // Error handled by useApiCall
    }
  }

  const handleCreateQuote = async () => {
    try {
      await callApi(async () => {
        const token = String(localStorage.getItem('auth_token'))
        const response = await apiService.createQuote({
          ...newQuote,
          id_cliente: user.id_usuario,
          cliente_nome: user.nome
        }, token)
        setQuotes([...quotes, response])
        setNewQuote({ observacoes: '' })
        setIsNewQuoteOpen(false)
      })
    } catch (err) {
      // Error handled by useApiCall
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'PENDENTE': { variant: 'destructive', label: 'Pendente' },
      'EM_ANALISE': { variant: 'default', label: 'Em Análise' },
      'RESPONDIDA': { variant: 'secondary', label: 'Respondida' },
      'FINALIZADA': { variant: 'outline', label: 'Finalizada' }
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading && quotes.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={loadQuotes} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Cotações</h3>
          <p className="text-gray-600">Gerencie suas solicitações de cotação</p>
        </div>
        {user.tipo_usuario === 'CLIENT' && (
          <Dialog open={isNewQuoteOpen} onOpenChange={setIsNewQuoteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Cotação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Cotação</DialogTitle>
                <DialogDescription>
                  Solicite uma nova cotação descrevendo os produtos necessários
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="observacoes">Descrição dos Produtos</Label>
                  <Textarea
                    id="observacoes"
                    value={newQuote.observacoes}
                    onChange={(e) => setNewQuote({ ...newQuote, observacoes: e.target.value })}
                    placeholder="Descreva os produtos que você precisa, quantidades, especificações..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewQuoteOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateQuote} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Cotação'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotações</CardTitle>
          <CardDescription>
            {quotes.filter(quote => user.tipo_usuario === 'ADMIN' || quote.id_cliente === user.id_usuario).length} cotações encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes
              .filter(quote => user.tipo_usuario === 'ADMIN' || quote.id_cliente === user.id_usuario)
              .map((quote) => (
                <div key={quote.id_cotacao} className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cotação #{quote.id_cotacao}</p>
                        <p className="text-sm text-gray-600">{quote.cliente_nome}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(quote.data_solicitacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{quote.observacoes}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(quote.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuotesManager