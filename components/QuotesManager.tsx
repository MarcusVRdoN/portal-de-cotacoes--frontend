import React, { useState, useEffect } from 'react'
import { Plus, FileText, Eye, RefreshCw, CheckCircle, Clock, XCircle, Trash2, Search, Reply, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { LoadingSpinner, ErrorMessage } from './LoadingAndError'
import { User, UserType } from '@/@types'
import { useQuotes, useProducts, useOrders } from '@/hooks/useApi'

interface QuoteItem {
  id_produto: number
  quantidade: number
  produto?: {
    nome_produto: string
    descricao: string
    estoque: number
  }
}

interface QuoteResponse {
  supplierId: number
  unitPrice: number
  deliveryTime: string
}

const QuotesManager = ({ user }: { user: User | null }) => {
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)
  const [isViewQuoteOpen, setIsViewQuoteOpen] = useState(false)
  const [isRespondQuoteOpen, setIsRespondQuoteOpen] = useState(false)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [newQuote, setNewQuote] = useState<{ items: QuoteItem[] }>({ items: [] })
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [selectedSupplierResponse, setSelectedSupplierResponse] = useState<any>(null)
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse>({
    supplierId: 0,
    unitPrice: 0,
    deliveryTime: ''
  })
  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const { quotes, suppliers, loading, error, fetchQuotes, createQuote, respondQuote, getSuppliers } = useQuotes()
  const { products, loading: loadingProducts, error: errorProducts, fetchProducts } = useProducts()
  const { loading: loadingOrders, createOrder } = useOrders()

  useEffect(() => {
    fetchQuotes()
    if (user?.tipo_usuario === UserType.SUPPLIER) {
      getSuppliers()
    }
  }, [])

  useEffect(() => {
    if (isNewQuoteOpen) {
      fetchProducts()
    }
  }, [isNewQuoteOpen])

  const handleCreateQuote = async () => {
    if (newQuote.items.length === 0) {
      alert('Adicione pelo menos um item à cotação')
      return
    }

    const payload = {
      items: newQuote.items.map(item => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade
      }))
    }

    await createQuote(payload)
    fetchQuotes()
    setIsNewQuoteOpen(false)
    setNewQuote({ items: [] })
    setProductSearch('')
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleCreateOrderFromQuote = async () => {
    if (!selectedQuote || !selectedSupplierResponse) {
      alert('Erro: dados da cotação não encontrados')
      return
    }

    try {
      const orderPayload = {
        items: selectedQuote.itensCotacao.map((item: any) => ({
          id_produto: item.id_produto,
          quantidade: item.quantidade,
          valor_unitario: selectedSupplierResponse.preco_unitario
        }))
      }

      await createOrder(orderPayload)
      alert('Pedido criado com sucesso!')
      setIsCreateOrderOpen(false)
      setSelectedSupplierResponse(null)
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao criar pedido. Tente novamente.')
    }
  }

  const handleOpenCreateOrderDialog = (quote: any, supplierResponse: any) => {
    setSelectedQuote(quote)
    setSelectedSupplierResponse(supplierResponse)
    setIsCreateOrderOpen(true)
  }

  const handleRespondQuote = async () => {
    if (!quoteResponse.supplierId || quoteResponse.unitPrice <= 0 || !quoteResponse.deliveryTime.trim()) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const payload = {
      supplierId: quoteResponse.supplierId,
      unitPrice: quoteResponse.unitPrice,
      deliveryTime: quoteResponse.deliveryTime
    }

    await respondQuote(selectedQuote.id_cotacao, payload)
    fetchQuotes()
    setIsRespondQuoteOpen(false)
    setQuoteResponse({ supplierId: 0, unitPrice: 0, deliveryTime: '' })
  }

  const handleAddItem = () => {
    if (!selectedProduct) {
      alert('Selecione um produto')
      return
    }

    if (quantity <= 0) {
      alert('Quantidade deve ser maior que zero')
      return
    }

    const product = products.find(p => p.id_produto === selectedProduct)
    if (!product) return

    const existingItemIndex = newQuote.items.findIndex(item => item.id_produto === selectedProduct)
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...newQuote.items]
      updatedItems[existingItemIndex].quantidade += quantity
      setNewQuote({ items: updatedItems })
    } else {
      const newItem: QuoteItem = {
        id_produto: selectedProduct,
        quantidade: quantity,
        produto: {
          nome_produto: product.nome_produto,
          descricao: product.descricao,
          estoque: product.estoque
        }
      }
      setNewQuote({ items: [...newQuote.items, newItem] })
    }

    setSelectedProduct(null)
    setQuantity(1)
    setProductSearch('')
  }

  const handleRemoveItem = (id_produto: number) => {
    setNewQuote({
      items: newQuote.items.filter(item => item.id_produto !== id_produto)
    })
  }

  const handleUpdateItemQuantity = (id_produto: number, newQuantity: number) => {
    if (newQuantity <= 0) return
    
    setNewQuote({
      items: newQuote.items.map(item => 
        item.id_produto === id_produto 
          ? { ...item, quantidade: newQuantity }
          : item
      )
    })
  }

  const handleViewQuote = (quote: React.SetStateAction<null>) => {
    console.log('Quote selecionada:', quote)
    console.log('Usuário atual:', user)
    console.log('Tipo do usuário:', user?.tipo_usuario)
    console.log('ID do cliente da cotação:', (quote as any)?.id_cliente)
    console.log('ID do usuário:', user?.id_usuario)
    setSelectedQuote(quote)
    setIsViewQuoteOpen(true)
  }

  const handleOpenRespondDialog = (quote: any) => {
    setSelectedQuote(quote)
    setIsRespondQuoteOpen(true)
    if (suppliers.length === 1) {
      setQuoteResponse(prev => ({ ...prev, supplierId: suppliers[0].id_fornecedor }))
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'PENDENTE': { variant: 'secondary', label: 'Pendente', icon: Clock },
      'CANCELADA': { variant: 'destructive', label: 'Cancelada', icon: XCircle },
      'RESPONDIDA': { variant: 'default', label: 'Respondida', icon: CheckCircle },
      'GANHA': { variant: 'outline', label: 'Ganha', icon: CheckCircle }
    }
    const config = variants[status] || { variant: 'default', label: status, icon: Clock }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getBestQuote = (respostas: any) => {
    if (!respostas || respostas.length === 0) return null
    return respostas.reduce((best: { preco_unitario: number }, current: { preco_unitario: number }) => 
      current.preco_unitario < best.preco_unitario ? current : best
    )
  }

  const filteredProducts = products.filter(product =>
    product.nome_produto.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.descricao.toLowerCase().includes(productSearch.toLowerCase())
  )

  const resetNewQuoteForm = () => {
    setNewQuote({ items: [] })
    setProductSearch('')
    setSelectedProduct(null)
    setQuantity(1)
  }

  const resetResponseForm = () => {
    setQuoteResponse({ supplierId: 0, unitPrice: 0, deliveryTime: '' })
  }

  const canRespondQuote = (quote: any) => {
    return user?.tipo_usuario === UserType.SUPPLIER && 
           quote.status === 'PENDENTE' &&
           !quote.respostas.some((r: any) => r.id_fornecedor === quoteResponse.supplierId)
  }

  if (loading && quotes.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => fetchQuotes()} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Cotações</h3>
          <p className="text-gray-600">
            {user?.tipo_usuario === UserType.CLIENT ? 'Gerencie suas solicitações de cotação' : 'Visualize e responda cotações'}
          </p>
        </div>
        {user?.tipo_usuario === UserType.CLIENT && (
          <Dialog open={isNewQuoteOpen} onOpenChange={(open) => {
            setIsNewQuoteOpen(open)
            if (!open) resetNewQuoteForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Cotação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Cotação</DialogTitle>
                <DialogDescription>
                  Selecione os produtos e quantidades para solicitar uma cotação
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Seleção de Produtos */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="product-search">Buscar Produto</Label>
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
                      <Input
                        id="product-search"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Digite o nome do produto..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      placeholder="Qtd"
                    />
                  </div>
                </div>

                {/* Lista de Produtos Filtrados */}
                {productSearch && (
                  <div className="overflow-y-auto border rounded-lg max-h-48">
                    <div className="p-2 space-y-1">
                      {loadingProducts ? (
                        <div className="py-4 text-center">
                          <RefreshCw className="w-4 h-4 mx-auto animate-spin" />
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id_produto}
                            className={`p-3 rounded cursor-pointer hover:bg-gray-50 border ${
                              selectedProduct === product.id_produto ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                            }`}
                            onClick={() => setSelectedProduct(product.id_produto)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{product.nome_produto}</h4>
                                <p className="text-xs text-gray-600">{product.descricao}</p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                Estoque: {product.estoque}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-4 text-sm text-center text-gray-500">
                          Nenhum produto encontrado
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Botão Adicionar Item */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddItem}
                    disabled={!selectedProduct || quantity <= 0}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {/* Lista de Itens Adicionados */}
                {newQuote.items.length > 0 && (
                  <div>
                    <Label className="block mb-3 text-sm font-medium text-gray-700">
                      Itens da Cotação ({newQuote.items.length} {newQuote.items.length === 1 ? 'item' : 'itens'})
                    </Label>
                    <div className="overflow-hidden border rounded-lg">
                      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50">
                        <div className="col-span-3">Produto</div>
                        <div className="text-center">Estoque</div>
                        <div className="text-center">Quantidade</div>
                        <div className="text-center">Ações</div>
                      </div>
                      {newQuote.items.map((item, index) => (
                        <div 
                          key={item.id_produto}
                          className={`px-4 py-3 grid grid-cols-6 gap-4 text-sm items-center ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <div className="col-span-3">
                            <p className="font-medium">{item.produto?.nome_produto}</p>
                            <p className="text-xs text-gray-600">{item.produto?.descricao}</p>
                          </div>
                          <div className="text-center">
                            <Badge variant="outline">{item.produto?.estoque}</Badge>
                          </div>
                          <div className="text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => handleUpdateItemQuantity(item.id_produto, Number(e.target.value))}
                              className="w-16 text-center"
                            />
                          </div>
                          <div className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id_produto)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewQuoteOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateQuote} 
                  disabled={loading || newQuote.items.length === 0}
                >
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

      {/* Dialog para visualizar detalhes da cotação */}
      <Dialog open={isViewQuoteOpen} onOpenChange={setIsViewQuoteOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Cotação #{selectedQuote?.id_cotacao}</DialogTitle>
            <DialogDescription>
              Informações completas sobre a cotação
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cliente</Label>
                  <p className="text-sm">{selectedQuote.cliente.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm">{selectedQuote.cliente.email}</p>
                </div>
              </div>

              {/* Informações da Cotação */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data da Solicitação</Label>
                  <p className="text-sm">
                    {new Date(selectedQuote.data_solicitacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedQuote.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Respostas Recebidas</Label>
                  <p className="text-sm font-medium">
                    {selectedQuote.respostas.length} fornecedor(es)
                  </p>
                </div>
              </div>

              {/* Lista de Itens Solicitados */}
              <div>
                <Label className="block mb-3 text-sm font-medium text-gray-700">
                  Itens Solicitados ({selectedQuote.itensCotacao.length} {selectedQuote.itensCotacao.length === 1 ? 'item' : 'itens'})
                </Label>
                <div className="overflow-hidden border rounded-lg">
                  <div className="grid grid-cols-2 gap-4 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50">
                    <div>Produto</div>
                    <div className="text-center">Quantidade</div>
                  </div>
                  {selectedQuote.itensCotacao.map((item: any, index: number) => (
                    <div 
                      key={`${item.id_cotacao}-${item.id_produto}`}
                      className={`px-4 py-3 grid grid-cols-2 gap-4 text-sm ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.produto.nome_produto}</p>
                      </div>
                      <div className="text-center">{item.quantidade}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Respostas dos Fornecedores */}
              {selectedQuote.respostas.length > 0 && (
                <div>
                  <Label className="block mb-3 text-sm font-medium text-gray-700">
                    Respostas dos Fornecedores
                  </Label>
                  <div className="space-y-3">
                    {selectedQuote.respostas
                      .sort((a: any, b: any) => a.preco_unitario - b.preco_unitario)
                      .map((resposta: any, index: number) => (
                      <div 
                        key={resposta.id_resposta} 
                        className={`border rounded-lg p-4 ${
                          index === 0 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {resposta.fornecedor.nome}
                            </h4>
                            {index === 0 && (
                              <Badge variant="outline" className="text-green-700 border-green-300">
                                Melhor Preço
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              R$ {resposta.preco_unitario.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">por unidade</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Contato</Label>
                            <p className="text-gray-700">{resposta.fornecedor.contato}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Prazo de Entrega</Label>
                            <p className="text-gray-700">{resposta.prazo_entrega}</p>
                          </div>
                        </div>
                        
                        {/* Valor total estimado */}
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">
                              Valor total estimado:
                            </span>
                            <span className="font-bold text-green-600">
                              R$ {(selectedQuote.itensCotacao.reduce((total: any, item: any) => 
                                total + (item.quantidade * resposta.preco_unitario), 0
                              )).toFixed(2)}
                            </span>
                          </div>
                          
                          {/* Botão para criar pedido - apenas para clientes donos da cotação */}
                          {user?.tipo_usuario === UserType.CLIENT && (
                            <div className="mt-3">
                              <Button 
                                onClick={() => handleOpenCreateOrderDialog(selectedQuote, resposta)}
                                className="w-full"
                                variant="default"
                                size="sm"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Criar Pedido com Esta Cotação
                              </Button>
                              {/* Debug info - remover em produção */}
                              {process.env.NODE_ENV === 'development' && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Debug: User Type: {user?.tipo_usuario}, Quote Owner: {selectedQuote?.id_cliente}, Current User: {user?.id_usuario}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem quando não há respostas */}
              {selectedQuote.respostas.length === 0 && selectedQuote.status === 'PENDENTE' && (
                <div className="py-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">Aguardando respostas dos fornecedores...</p>
                </div>
              )}

              {selectedQuote.respostas.length === 0 && selectedQuote.status === 'CANCELADA' && (
                <div className="py-8 text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                  <p className="text-red-500">Esta cotação foi cancelada</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {user?.tipo_usuario === UserType.SUPPLIER && canRespondQuote(selectedQuote) && (
              <Button 
                onClick={() => {
                  setIsViewQuoteOpen(false)
                  handleOpenRespondDialog(selectedQuote)
                }}
                className="mr-2"
              >
                <Reply className="w-4 h-4 mr-2" />
                Responder Cotação
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsViewQuoteOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar criação de pedido */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar Criação de Pedido</DialogTitle>
            <DialogDescription>
              Revise os detalhes do pedido antes de confirmar
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && selectedSupplierResponse && (
            <div className="space-y-4">
              {/* Informações do Fornecedor */}
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="mb-2 font-medium text-blue-900">Fornecedor Selecionado</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-blue-700">Nome</Label>
                    <p className="font-medium">{selectedSupplierResponse.fornecedor.nome}</p>
                  </div>
                  <div>
                    <Label className="text-blue-700">Contato</Label>
                    <p>{selectedSupplierResponse.fornecedor.contato}</p>
                  </div>
                  <div>
                    <Label className="text-blue-700">Preço Unitário</Label>
                    <p className="font-medium">R$ {selectedSupplierResponse.preco_unitario.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-blue-700">Prazo de Entrega</Label>
                    <p>{selectedSupplierResponse.prazo_entrega}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Itens do Pedido */}
              <div>
                <Label className="block mb-3 text-sm font-medium text-gray-700">
                  Itens do Pedido
                </Label>
                <div className="overflow-hidden border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50">
                    <div>Produto</div>
                    <div className="text-center">Quantidade</div>
                    <div className="text-center">Valor Unitário</div>
                    <div className="text-center">Subtotal</div>
                  </div>
                  {selectedQuote.itensCotacao.map((item: any, index: number) => (
                    <div 
                      key={`${item.id_produto}`}
                      className={`px-4 py-3 grid grid-cols-4 gap-4 text-sm ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.produto.nome_produto}</p>
                        <p className="text-xs text-gray-600">{item.produto.descricao}</p>
                      </div>
                      <div className="text-center">{item.quantidade}</div>
                      <div className="text-center">R$ {selectedSupplierResponse.preco_unitario.toFixed(2)}</div>
                      <div className="font-medium text-center">
                        R$ {(item.quantidade * selectedSupplierResponse.preco_unitario).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo do Pedido */}
              <div className="p-4 rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">Total do Pedido</h4>
                    <p className="text-sm text-green-700">
                      {selectedQuote.itensCotacao.reduce((total: any, item: any) => total + item.quantidade, 0)} itens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(selectedQuote.itensCotacao.reduce((total: any, item: any) => 
                        total + (item.quantidade * selectedSupplierResponse.preco_unitario), 0
                      )).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateOrderFromQuote}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Criando Pedido...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Confirmar Pedido
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para responder cotação */}
      <Dialog open={isRespondQuoteOpen} onOpenChange={(open) => {
        setIsRespondQuoteOpen(open)
        if (!open) resetResponseForm()
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Responder Cotação #{selectedQuote?.id_cotacao}</DialogTitle>
            <DialogDescription>
              Preencha os dados da sua proposta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-select">Fornecedor</Label>
              <Select
                value={quoteResponse.supplierId.toString()}
                onValueChange={(value) => setQuoteResponse(prev => ({ ...prev, supplierId: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id_fornecedor} value={supplier.id_fornecedor.toString()}>
                      {supplier.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit-price">Preço Unitário (R$)</Label>
              <Input
                id="unit-price"
                type="number"
                min="0"
                step="0.01"
                value={quoteResponse.unitPrice}
                onChange={(e) => setQuoteResponse(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="delivery-time">Prazo de Entrega</Label>
              <Input
                id="delivery-time"
                value={quoteResponse.deliveryTime}
                onChange={(e) => setQuoteResponse(prev => ({ ...prev, deliveryTime: e.target.value }))}
                placeholder="Ex: 5 dias úteis, 2 semanas..."
              />
            </div>

            {/* Cálculo do valor total estimado */}
            {selectedQuote && quoteResponse.unitPrice > 0 && (
              <div className="p-3 rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-700">Valor Total Estimado</Label>
                <p className="text-lg font-bold text-green-600">
                  R$ {(selectedQuote.itensCotacao.reduce((total: any, item: any) => 
                    total + (item.quantidade * quoteResponse.unitPrice), 0
                  )).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Baseado em {selectedQuote.itensCotacao.reduce((total: any, item: any) => total + item.quantidade, 0)} itens
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRespondQuoteOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleRespondQuote}
              disabled={loading || !quoteResponse.supplierId || quoteResponse.unitPrice <= 0 || !quoteResponse.deliveryTime.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Resposta'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotações</CardTitle>
          <CardDescription>
            {quotes.length} cotações encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes
              ?.map((quote) => {
                const bestQuote = getBestQuote(quote.respostas)
                return (
                  <div key={quote.id_cotacao} className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Cotação #{quote.id_cotacao}</p>
                          <p className="text-sm text-gray-600">{quote.cliente.nome}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(quote.data_solicitacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2 space-x-4">
                        <p className="text-sm text-gray-700">
                          {quote.itensCotacao.length} {quote.itensCotacao.length === 1 ? 'item' : 'itens'}
                        </p>
                        {quote.respostas.length > 0 && (
                          <p className="text-sm text-gray-700">
                            {quote.respostas.length} {quote.respostas.length === 1 ? 'resposta' : 'respostas'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        {bestQuote && (
                          <p className="text-sm font-medium text-green-600">
                            Melhor: R$ {bestQuote.preco_unitario.toFixed(2)}
                          </p>
                        )}
                        {getStatusBadge(quote?.status)}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user?.tipo_usuario === UserType.SUPPLIER && canRespondQuote(quote) && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleOpenRespondDialog(quote)}
                          >
                            <Reply className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuotesManager