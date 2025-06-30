import { useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingAndError"
import { ErrorMessage } from "./ui/errors"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { useProducts } from "@/hooks/useApi"

const ProductsManager = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ productName: '', description: '', quantity: 0, })
  const [editingProduct, setEditingProduct] = useState({ id: 0, productName: '', description: '', quantity: 0, })
  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreateProduct = async () => {
    await createProduct(newProduct)
    fetchProducts()
    setIsNewProductOpen(false)
    setNewProduct({ productName: '', description: '', quantity: 0, })
  }

  const handleEditProduct = async (product: { id_produto: number; nome_produto: string; descricao: string; estoque: number; }) => {
    setEditingProduct({
      id: product.id_produto,
      productName: product.nome_produto,
      description: product.descricao,
      quantity: product.estoque
    })
    setIsEditProductOpen(true)
  }

  const handleUpdateProduct = async () => {
    await updateProduct(editingProduct.id, {
      productName: editingProduct.productName,
      description: editingProduct.description,
      quantity: Number(editingProduct.quantity),
    })
    fetchProducts()
    setIsEditProductOpen(false)
    setEditingProduct({ id: 0, productName: '', description: '', quantity: 0, })
  }

  if (loading && products.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => fetchProducts()} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Produtos</h3>
          <p className="text-gray-600">Gerencie o catálogo de produtos</p>
        </div>
        {/* Dialog de criação de produto */}
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
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estoque">Quantidade em Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                    placeholder="0"
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

        {/* Dialog de edição de produto */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Edite os detalhes do produto
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome_produto">Nome do Produto</Label>
                <Input
                  id="nome_produto"
                  value={editingProduct.productName}
                  onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Descrição detalhada do produto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estoque">Quantidade em Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateProduct} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Atualizar Produto'
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
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex w-full space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled={loading} onClick={() => handleEditProduct(product)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" disabled={loading} onClick={() => deleteProduct(product.id_produto)}>
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