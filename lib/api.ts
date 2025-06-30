import { ApiResponse } from "@/@types"

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = String(process.env.NEXT_PUBLIC_API_BASE_URL)

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  removeToken() {
    this.token = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Autenticação
  async login(email: string, senha: string) {
    return this.request<{ token: string; user: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    })
  }

  async register(userData: any) {
    return this.request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile() {
    return this.request<any>('/auth/profile')
  }

  // Usuários
  async getUsers() {
    return this.request<any[]>('/users')
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: number, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Cotações
  async getQuotes() {
    return this.request<any[]>('/quotes')
  }

  async createQuote(quoteData: any) {
    return this.request<any>('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })
  }

  async updateQuoteStatus(id: number, status: string) {
    return this.request<any>(`/quotes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async respondQuote(id: number, responseData: any) {
    return this.request<any>(`/quotes/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    })
  }

  // Pedidos
  async getOrders() {
    return this.request<any[]>('/orders')
  }

  async createOrder(orderData: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async updateOrder(id: number, orderData: any) {
    return this.request<any>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    })
  }

  async cancelOrder(id: number) {
    return this.request<any>(`/orders/${id}/cancel`, {
      method: 'PUT',
    })
  }

  // Produtos
  async getProducts() {
    return this.request<any[]>('/stock/products')
  }

  async createProduct(productData: any) {
    return this.request<any>('/stock/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: number, productData: any) {
    return this.request<any>(`/stock/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async updateProductStock(id: number, estoque: number, operacao: 'add' | 'remove') {
    return this.request<any>(`/stock/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ estoque, operacao }),
    })
  }

  async deleteProduct(id: number) {
    return this.request<any>(`/stock/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Relatórios
  async getStockReport() {
    return this.request<any>('/stock/report')
  }

  async getLowStockReport(limite: number = 10) {
    return this.request<any>(`/stock/report/low?limite=${limite}`)
  }

  async getOrdersReport() {
    return this.request<any>('/orders/report')
  }

  async getUsersReport() {
    return this.request<any>('/users/report')
  }
}

export const apiService = new ApiService()