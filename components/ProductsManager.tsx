import { useApiCall } from "@/hooks/useApiCall"
import { apiService } from "@/services/apiService"
import { Product } from "@/types"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingAndError"
import { ErrorMessage } from "./ui/errors"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog"
import { Button } from "./ui/button"
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nome_produto: '',
    descricao: '',
    estoque: '',
    preco: ''
  })
  const { loading, error, callApi } = useApiCall()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      await callApi(async () => {
        const token = String(localStorage.getItem('auth_token'))
        const response = await apiService.getProducts(token)
        setProducts(response.produtos)
      })
    } catch (err) {
      // Error handled by useApiCall
    }
  }

  const handleCreateProduct = async () => {
    try {
      await callApi(async () => {
        const productData = {
          nome_produto: newProduct.nome_produto,
          descricao: newProduct.descricao,
          estoque: Number(newProduct.estoque),
          preco: Number(newProduct.preco)
        }
        const token = String(localStorage.getItem('auth_token'))
        const response = await apiService.createProduct(productData, token)
        setProducts([...products, response])
        setNewProduct({ nome_produto: '', descricao: '', estoque: '', preco: '' })
        setIsNewProductOpen(false)
      })
    } catch (err) {
      // Error handled by useApiCall
    }
  }

  if (loading && products.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Produtos</h3>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
              <DialogDescription>
                Adicione um novo produto ao catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome_produto">Nome do Produto</Label>
                <Input
                  id="nome_produto"
                  value={newProduct.nome_produto}
                  onChange={(e) => setNewProduct({ ...newProduct, nome_produto: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newProduct.descricao}
                  onChange={(e) => setNewProduct({ ...newProduct, descricao: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estoque">Quantidade em Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={newProduct.estoque}
                    onChange={(e) => setNewProduct({ ...newProduct, estoque: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço Unitário (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={newProduct.preco}
                    onChange={(e) => setNewProduct({ ...newProduct, preco: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewProductOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProduct} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Produto'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>{products.length} produtos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id_produto} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{product.nome_produto}</CardTitle>
                  <CardDescription className="text-sm">{product.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Estoque:</span>
                    <Badge variant={product.estoque < 50 ? 'destructive' : 'secondary'}>
                      {product.estoque} unidades
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preço:</span>
                    <span className="text-lg font-bold">R$ {product.preco.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex w-full space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductsManager