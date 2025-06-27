import { 
  Product,
  User,
  Quote,
  Order,
  Supplier,
  OrderItem,
} from '../types';

// Base URL for all API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Internal helper to perform HTTP requests.
 * @template T - Expected return type
 * @param {string} path - API endpoint path (e.g. "/auth/signin")
 * @param {RequestInit} [options] - Fetch options (method, headers, body, etc.)
 * @returns {Promise<T>} Parsed JSON response
 * @throws {Error} When the response is not ok
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      (errorBody as any).message || res.statusText || 'API request failed'
    );
  }

  return res.json();
}

export const apiService = {
  /**
   * Sign up a new user
   * @param {{ nome: string; email: string; senha: string; tipo_usuario: string }} data
   * @returns {Promise<AuthResponse>} Authentication token and user info
   */
  async signup(data: {
    nome: string;
    email: string;
    senha: string;
    tipo_usuario: 'ADMIN' | 'CLIENT' | 'SUPPLIER';
  }): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Log in and retrieve JWT
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<AuthResponse>} Authentication token and user info
   */
  async login(email: string, senha: string): Promise<any> {
    return request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
  },

  /**
   * Get current user's profile
   * @param {string} token - Bearer token
   * @returns {Promise<User>} Authenticated user data
   */
  async getProfile(token: string): Promise<User> {
    return request<User>('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * List all users (paginated)
   */
  async listUsers(
    token: string,
    page = 1,
    limit = 10
  ): Promise<{ usuarios: User[] }> {
    const path = `/api/users?page=${page}&limit=${limit}`;
    return request<{ usuarios: User[] }>(path, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * List all products (paginated)
   * @param {string} token
   * @param {number} [page=1]
   * @param {number} [limit=10]
   * @param {string} [search]
   * @returns {Promise<{ produtos: Product[] }>} List of products
   */
  async getProducts(
    token: string,
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ produtos: Product[] }> {
    let path = `/stock/products?page=${page}&limit=${limit}`;
    if (search) {
      path += `&search=${encodeURIComponent(search)}`;
    }

    return request<{ produtos: Product[] }>(path, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Get a single product by ID
   * @param {number} id
   * @param {string} token
   * @returns {Promise<Product>}
   */
  async getProductById(id: number, token: string): Promise<Product> {
    return request<Product>(`/stock/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Create a new product
   * @param {Omit<Product, 'id_produto'>} productData
   * @param {string} token
   * @returns {Promise<Product>}
   */
  async createProduct(
    productData: Omit<Product, 'id_produto'>,
    token: string
  ): Promise<Product> {
    return request<Product>('/stock/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(productData)
    });
  },

  /**
   * List suppliers available for quoting
   * @param {string} token
   * @returns {Promise<{ fornecedores: Supplier[] }>}
   */
  async listSuppliers(token: string): Promise<{ fornecedores: Supplier[] }> {
    return request<{ fornecedores: Supplier[] }>('/quotes/suppliers', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Create a new quote
   * @param {{ observacoes: string }} quoteData
   * @param {string} token
   * @returns {Promise<{ cotacao: Quote }>}
   */
  async createQuote(
    quoteData: { observacoes: string },
    token: string
  ): Promise<{ cotacao: Quote }> {
    return request<{ cotacao: Quote }>('/quotes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(quoteData)
    });
  },

  /**
   * List user quotes (paginated / filtered)
   * @param {string} token
   * @param {number} [page=1]
   * @param {number} [limit=10]
   * @param {string} [status]
   * @returns {Promise<{ cotacoes: Quote[] }>}
   */
  async getQuotes(
    token: string,
    page = 1,
    limit = 10,
    status?: string
  ): Promise<{ cotacoes: Quote[] }> {
    let path = `/quotes?page=${page}&limit=${limit}`;
    if (status) {
      path += `&status=${encodeURIComponent(status)}`;
    }

    return request<{ cotacoes: Quote[] }>(path, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  /**
   * Respond to a quote as a supplier
   * @param {number} cotacaoId
   * @param {{ id_fornecedor: number; preco_unitario: number; prazo_entrega: string }} data
   * @param {string} token
   * @returns {Promise<{ cotacao: Quote }>}
   */
  async respondQuote(
    cotacaoId: number,
    data: { id_fornecedor: number; preco_unitario: number; prazo_entrega: string },
    token: string
  ): Promise<{ cotacao: Quote }> {
    return request<{ cotacao: Quote }>(`/quotes/${cotacaoId}/respond`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
  },

  /**
   * Create a new order with items
   * @param {OrderItem[]} items
   * @param {string} token
   * @returns {Promise<{ pedido: Order }>}
   */
  async createOrder(
    items: OrderItem[],
    token: string
  ): Promise<{ pedido: Order }> {
    return request<{ pedido: Order }>('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ itens: items })
    });
  },

  /**
   * List user orders (paginated)
   * @param {string} token
   * @param {number} [page=1]
   * @param {number} [limit=10]
   * @returns {Promise<{ pedidos: Order[] }>}
   */
  async getOrders(
    token: string,
    page = 1,
    limit = 10
  ): Promise<{ pedidos: Order[] }> {
    return request<{ pedidos: Order[] }>(
      `/orders?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  /**
   * Cancel an existing order
   * @param {number} pedidoId
   * @param {string} token
   * @returns {Promise<{ pedido: Order }>}
   */
  async cancelOrder(pedidoId: number, token: string): Promise<{ pedido: Order }> {
    return request<{ pedido: Order }>(
      `/orders/${pedidoId}/cancel`,
      { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
    );
  },

  /**
   * Health check for the API
   * @returns {Promise<{ status: string }>}
   */
  async health(): Promise<{ status: string }> {
    return request<{ status: string }>('/health');
  }
};
