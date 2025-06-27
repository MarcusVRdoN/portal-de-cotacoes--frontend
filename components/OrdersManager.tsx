import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Eye, Plus, ShoppingCart} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Order } from "@/types"
import { useApiCall } from "@/hooks/useApiCall"
import { apiService } from "@/services/apiService"
import { LoadingSpinner } from "./ui/loading"
import { ErrorMessage } from "./ui/errors"

const OrdersManager = ({ user }: any) => {
  const [orders, setOrders] = useState<Order[]>([])
  const { loading, error, callApi } = useApiCall()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      await callApi(async () => {
        // const response = await apiService.getOrders()
        // setOrders(response.data)
      })
    } catch (err) {
      // Error handled by useApiCall
    }
  }

  if (loading && orders.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={loadOrders} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Pedidos</h3>
          <p className="text-gray-600">Gerencie seus pedidos</p>
        </div>
        {user.tipo_usuario === 'CLIENT' && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {orders.filter(order => user.tipo_usuario === 'ADMIN' || order.id_cliente === user.id_usuario).length} pedidos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders
              .filter(order => user.tipo_usuario === 'ADMIN' || order.id_cliente === user.id_usuario)
              .map((order) => (
                <div key={order.id_pedido} className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{order.id_pedido}</p>
                        <p className="text-sm text-gray-600">{order.cliente_nome}</p>
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
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
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

export default OrdersManager