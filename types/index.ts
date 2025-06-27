export interface User {
  id_usuario: number
  nome: string
  email: string
  tipo_usuario: 'ADMIN' | 'CLIENT' | 'SUPPLIER'
}

export interface Product {
  id_produto: number
  nome_produto: string
  descricao: string
  estoque: number
  preco: number
}

export interface Quote {
  id_cotacao: number
  data_solicitacao: string
  status: string
  observacoes: string
  id_cliente: number
  cliente_nome?: string
}

export interface Order {
  id_pedido: number
  data_pedido: string
  valor_total: number
  status: string
  id_cliente: number
  cliente_nome?: string
  itens: OrderItem[]
}

export interface OrderItem {
  id_produto: number
  nome_produto?: string
  quantidade: number
  valor_unitario: number
}

export interface MenuItem {
  id: string
  label: string
  icon: any
  roles: string[]
}

export interface Stat {
  title: string
  value: string
  change: string
  color: string
  bgColor: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}