import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Eye, Plus, RefreshCw, ShoppingCart, Search, Trash2} from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { LoadingSpinner } from "./LoadingAndError"
import { ErrorMessage } from "./ui/errors"
import { useOrders, useProducts } from "@/hooks/useApi"
import { type OrderResponse, User, UserType } from "@/@types"

interface OrderItem {
  id_produto: number
  quantidade: number
  valor_unitario: number
  produto?: {
    nome_produto: string
    descricao: string
    estoque: number
  }
}

const OrdersManager = ({ user }: { user: User | null }) => {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<{ items: OrderItem[] }>({ items: [] })
  const [selectedOrder, setSelectedOrder] = useState({} as OrderResponse)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  
  const { orders, loading, error, fetchOrders, createOrder } = useOrders()
  const { products, loading: loadingProducts, error: errorProducts, fetchProducts } = useProducts()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (isNewOrderOpen) {
      fetchProducts()
    }
  }, [isNewOrderOpen])

  const handleCreateOrder = async () => {
    if (newOrder.items.length === 0) {
      alert('Adicione pelo menos um item ao pedido')
      return
    }

    const payload = {
      items: newOrder.items.map(item => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario
      }))
    }

    await createOrder(payload)
    fetchOrders()
    setIsNewOrderOpen(false)
    resetNewOrderForm()
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

    if (unitPrice <= 0) {
      alert('Valor unitário deve ser maior que zero')
      return
    }

    const product = products.find(p => p.id_produto === selectedProduct)
    if (!product) return

    // Verificar se o produto já foi adicionado
    const existingItemIndex = newOrder.items.findIndex(item => item.id_produto === selectedProduct)
    
    if (existingItemIndex >= 0) {
      // Atualizar item existente
      const updatedItems = [...newOrder.items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantidade: updatedItems[existingItemIndex].quantidade + quantity,
        valor_unitario: unitPrice // Atualiza o valor unitário
      }
      setNewOrder({ items: updatedItems })
    } else {
      // Adicionar novo item
      const newItem: OrderItem = {
        id_produto: selectedProduct,
        quantidade: quantity,
        valor_unitario: unitPrice,
        produto: {
          nome_produto: product.nome_produto,
          descricao: product.descricao,
          estoque: product.estoque
        }
      }
      setNewOrder({ items: [...newOrder.items, newItem] })
    }

    // Resetar campos
    resetItemForm()
  }

  const handleRemoveItem = (id_produto: number) => {
    setNewOrder({
      items: newOrder.items.filter(item => item.id_produto !== id_produto)
    })
  }

  const handleUpdateItem = (id_produto: number, field: string, value: number) => {
    if (value <= 0) return
    
    setNewOrder({
      items: newOrder.items.map(item => 
        item.id_produto === id_produto 
          ? { ...item, [field]: value }
          : item
      )
    })
  }

  const resetItemForm = () => {
    setSelectedProduct(null)
    setQuantity(1)
    setUnitPrice(0)
    setProductSearch('')
  }

  const resetNewOrderForm = () => {
    setNewOrder({ items: [] })
    resetItemForm()
  }

  const handleViewOrder = (order: OrderResponse) => {
    setSelectedOrder(order)
    setIsViewOrderOpen(true)
  }

  const getStatusBadge = (status: string | number) => {
    const variants: Record<string, any> = {
      'Pendente': { variant: "secondary", label: "Pendente" },
      'Em Processamento': { variant: "default", label: "Em Processamento" },
      'Enviado': { variant: "outline", label: "Enviado" },
      'Entregue': { variant: "success", label: "Entregue" },
      'Cancelado': { variant: "destructive", label: "Cancelado" },
    }
    const config = variants[status] || { variant: "secondary", label: status || "Pendente" }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredProducts = products.filter(product =>
    product.nome_produto.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.descricao.toLowerCase().includes(productSearch.toLowerCase())
  )

  const calculateTotal = () => {
    return newOrder.items.reduce((total, item) => 
      total + (item.quantidade * item.valor_unitario), 0
    )
  }

  if (loading && orders.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => fetchOrders()} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Pedidos</h3>
          <p className="text-gray-600">Gerencie seus pedidos</p>
        </div>
        {user?.tipo_usuario === UserType.CLIENT && (
          <Dialog open={isNewOrderOpen} onOpenChange={(open) => {
            setIsNewOrderOpen(open)
            if (!open) resetNewOrderForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Pedido</DialogTitle>
                <DialogDescription>
                  Selecione os produtos, quantidades e valores para criar um novo pedido
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Seleção de Produtos */}
                <div className="grid grid-cols-4 gap-4">
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
                  <div>
                    <Label htmlFor="unit-price">Valor Unitário (R$)</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      placeholder="0,00"
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
                    disabled={!selectedProduct || quantity <= 0 || unitPrice <= 0}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {/* Lista de Itens Adicionados */}
                {newOrder.items.length > 0 && (
                  <div>
                    <Label className="block mb-3 text-sm font-medium text-gray-700">
                      Itens do Pedido ({newOrder.items.length} {newOrder.items.length === 1 ? 'item' : 'itens'})
                    </Label>
                    <div className="overflow-hidden border rounded-lg">
                      <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50">
                        <div className="col-span-2">Produto</div>
                        <div className="text-center">Estoque</div>
                        <div className="text-center">Quantidade</div>
                        <div className="text-center">Valor Unitário</div>
                        <div className="text-center">Subtotal</div>
                        <div className="text-center">Ações</div>
                      </div>
                      {newOrder.items.map((item, index) => (
                        <div 
                          key={item.id_produto}
                          className={`px-4 py-3 grid grid-cols-7 gap-4 text-sm items-center ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <div className="col-span-2">
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
                              onChange={(e) => handleUpdateItem(item.id_produto, 'quantidade', Number(e.target.value))}
                              className="w-16 text-center"
                            />
                          </div>
                          <div className="text-center">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.valor_unitario}
                              onChange={(e) => handleUpdateItem(item.id_produto, 'valor_unitario', Number(e.target.value))}
                              className="w-20 text-center"
                            />
                          </div>
                          <div className="font-medium text-center">
                            R$ {(item.quantidade * item.valor_unitario).toFixed(2)}
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
                      
                      {/* Total */}
                      <div className="grid grid-cols-7 gap-4 px-4 py-3 font-bold bg-gray-100">
                        <div className="col-span-5 text-right">Total do Pedido:</div>
                        <div className="text-center text-green-600">
                          R$ {calculateTotal().toFixed(2)}
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateOrder} 
                  disabled={loading || newOrder.items.length === 0}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Pedido'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Dialog para visualizar detalhes do pedido */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id_pedido}</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Informações do Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cliente</Label>
                  <p className="text-sm">{selectedOrder.cliente?.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm">{selectedOrder.cliente?.email}</p>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data do Pedido</Label>
                  <p className="text-sm">
                    {new Date(selectedOrder.data_pedido).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge((selectedOrder as any)?.status || 'Pendente')}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Valor Total</Label>
                  <p className="text-sm font-bold text-green-600">
                    R$ {selectedOrder.valor_total?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Lista de Itens */}
              <div>
                <Label className="block mb-3 text-sm font-medium text-gray-700">
                  Itens do Pedido ({selectedOrder.itens?.length} {selectedOrder.itens?.length === 1 ? 'item' : 'itens'})
                </Label>
                <div className="overflow-hidden border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50">
                    <div>Produto</div>
                    <div className="text-center">Quantidade</div>
                    <div className="text-center">Valor Unitário</div>
                    <div className="text-center">Subtotal</div>
                  </div>
                  {selectedOrder.itens?.map((item, index) => (
                    <div 
                      key={item.id_item_pedido} 
                      className={`px-4 py-3 grid grid-cols-4 gap-4 text-sm ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{item.produto.nome_produto}</p>
                      </div>
                      <div className="text-center">{item.quantidade}</div>
                      <div className="text-center">R$ {item.valor_unitario?.toFixed(2)}</div>
                      <div className="font-medium text-center">
                        R$ {(item.quantidade * item.valor_unitario)?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total de {selectedOrder.itens?.reduce((acc, item) => acc + item.quantidade, 0)} itens
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Total: R$ {selectedOrder.valor_total?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOrderOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {orders.filter(order => user?.tipo_usuario === UserType.ADMIN || order.id_cliente === user?.id_usuario).length} pedidos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders
              .filter(order => user?.tipo_usuario === UserType.ADMIN || order.id_cliente === user?.id_usuario)
              .map((order) => (
                <div key={order.id_pedido} className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{order.id_pedido}</p>
                        <p className="text-sm text-gray-600">{order.cliente.nome}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">
                      {order.itens.length} {order.itens.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="font-bold">R$ {order.valor_total.toFixed(2)}</p>
                      {getStatusBadge((order as any).status || 'Pendente')}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
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

export default OrdersManager