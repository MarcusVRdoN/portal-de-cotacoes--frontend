import axios, { AxiosInstance } from 'axios';
import type { AuthResponse, AxiosResponse, Order, OrderResponse, PaginationParams, Product, Quote, QuoteResponse, StockUpdate, User, UserType } from '@/@types/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://2kb8y5mqe6.execute-api.us-east-1.amazonaws.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // this.api.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     if (error.response?.status === 401) {
    //       this.clearToken();

    //       if (typeof window !== 'undefined') {
    //         window.location.href = '/login';
    //       }
    //     }

    //     return Promise.reject(error);
    //   }
    // );

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string): void {
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken(): void {
    this.token = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // AUTH ENDPOINTS
  async signUp(userData: { name: string; email: string; password: string; userType: UserType }): Promise<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType }> {
    const response: AxiosResponse<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType }> = await this.api.post('/auth/signup', userData);
    return response.data.data;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data: { data } }: AxiosResponse<AuthResponse> = await this.api.post('/auth/signin', {
      email,
      password,
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async signOut(): Promise<void> {
    this.clearToken();
  }

  // PRODUCT ENDPOINTS
  async createProduct(product: Product): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post('/products', product);
    return response.data.data;
  }

  async getProducts(params?: PaginationParams): Promise<{id_produto: number, nome_produto: string, descricao: string, estoque: number}[]> {
    const response: AxiosResponse<{ products: {id_produto: number, nome_produto: string, descricao: string, estoque: number}[] }> = await this.api.get('/products', { params });
    return response.data.data.products;
  }

  async getProduct(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${id}`);
    return response.data.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.put(`/products/${id}`, product);
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // ORDER ENDPOINTS
  async createOrder(order: Order): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders', order);
    return response.data.data;
  }

  async getOrders(params?: PaginationParams): Promise<OrderResponse[]> {
    const response: AxiosResponse<{ orders: OrderResponse[] }> = await this.api.get('/orders', { params });
    return response.data.data.orders;
  }

  async getOrder(id: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
    return response.data.data;
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.put(`/orders/${id}`, order);
    return response.data.data;
  }

  async getOrderReport(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/orders/report');
    return response.data.data;
  }

  // QUOTE ENDPOINTS
  async createQuote(quote: Quote): Promise<Quote> {
    const response: AxiosResponse<Quote> = await this.api.post('/quotes', quote);
    return response.data.data;
  }

  async getQuotes(): Promise<Quote[]> {
    const response: AxiosResponse<{ quotes: Quote[] }> = await this.api.get('/quotes');
    return response.data.data.quotes;
  }

  async getQuote(id: number): Promise<Quote> {
    const response: AxiosResponse<Quote> = await this.api.get(`/quotes/${id}`);
    return response.data.data;
  }

  async updateQuoteStatus(id: number, status: string): Promise<Quote> {
    const response: AxiosResponse<Quote> = await this.api.put(`/quotes/${id}/status`, { status });
    return response.data.data;
  }

  async deleteQuote(id: number): Promise<void> {
    await this.api.delete(`/quotes/${id}`);
  }

  async respondQuote(id: number, response: QuoteResponse): Promise<any> {
    const result: AxiosResponse<any> = await this.api.post(`/quotes/${id}/respond`, response);
    return result.data;
  }

  async getSuppliers(): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.api.get('/quotes/suppliers');
    return response.data.data;
  }

  async getQuotesReport(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/quotes/report');
    return response.data.data;
  }

  // STOCK ENDPOINTS
  async updateStock(productId: number, stockUpdate: StockUpdate): Promise<any> {
    const response: AxiosResponse<any> = await this.api.put(`/stock/products/${productId}`, stockUpdate);
    return response.data.data;
  }

  async getLowStockReport(quantity?: number): Promise<any> {
    const params = quantity ? { quantity } : {};
    const response: AxiosResponse<any> = await this.api.get('/stock/report/low', { params });
    return response.data.data;
  }

  async getStockReport(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/stock/report');
    return response.data.data;
  }

  // USER ENDPOINTS
  async getUsers(params?: PaginationParams): Promise<User[]> {
    const response: AxiosResponse<{ users: User[] }> = await this.api.get('/users', { params });
    return response.data.data.users;
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: number, user: { name: string; email: string; newPassword: string; userType: UserType }): Promise<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType }> {
    const response: AxiosResponse<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType }> = await this.api.put(`/users/${id}`, user);
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async getUserProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/users/profile');
    return response.data.data;
  }

  async updateUserProfile(profileData: { password: string; newPassword: string }): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put('/users/profile', profileData);
    return response.data.data;
  }

  async getUsersReport(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/users/report');
    return response.data.data;
  }
}

// Exportar instância única
export const apiService = new ApiService();
export default apiService;