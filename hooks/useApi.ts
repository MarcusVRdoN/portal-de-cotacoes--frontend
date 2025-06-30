import { useState, useEffect } from 'react';
import { apiService } from '@/services';
import type { User, Product, Order, Quote, UserType, OrderResponse } from '@/@types/api';

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiService.signIn(email, password);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: { name: string; email: string; password: string; userType: UserType }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.signUp(userData);
      setUser(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await apiService.signOut();
    setUser(null);
  };

  const getUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile: any = await apiService.getUserProfile();
      setUser(profile);
      return profile;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    getUserProfile,
  };
};

// Hook para produtos
export const useProducts = () => {
  const [products, setProducts] = useState<{id_produto: number, nome_produto: string, descricao: string, estoque: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (params?: { limit?: number; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getProducts({ limit: 100, ...params });
      setProducts(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: { productName: string; description: string; quantity: number }) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct: any = await apiService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, product: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct: any = await apiService.updateProduct(id, product);
      setProducts(prev => prev.map(product => product.id_produto === id ? updatedProduct : product));
      return updatedProduct;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id_produto !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

// Hook para pedidos
export const useOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (params?: { limit?: number; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getOrders({ limit: 100, ...params });
      setOrders(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pedidos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (order: Order) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder: any = await apiService.createOrder(order);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: number, order: Partial<Order>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder: any = await apiService.updateOrder(id, order);
      setOrders(prev => prev.map(order => order.id_pedido === id ? updatedOrder : order));
      return updatedOrder;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await apiService.getOrderReport();
      return report;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    getOrderReport,
  };
};

// Hook para cotações
export const useQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getQuotes();
      setQuotes(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar cotações');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quote: Quote) => {
    setLoading(true);
    setError(null);
    try {
      const newQuote = await apiService.createQuote(quote);
      setQuotes(prev => [...prev, newQuote]);
      return newQuote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar cotação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedQuote = await apiService.updateQuoteStatus(id, status);
      setQuotes(prev => prev.map(q => q.id === id ? updatedQuote : q));
      return updatedQuote;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteQuote(id);
      setQuotes(prev => prev.filter(q => q.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar cotação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const respondQuote = async (id: number, response: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.respondQuote(id, response);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao responder cotação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const suppliers = await apiService.getSuppliers();
      setSuppliers(suppliers);
      return suppliers;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar fornecedores');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuotesReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await apiService.getQuotesReport();
      return report?.statistics;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quotes,
    suppliers,
    loading,
    error,
    fetchQuotes,
    createQuote,
    updateQuoteStatus,
    deleteQuote,
    respondQuote,
    getSuppliers,
    getQuotesReport,
  };
};

// Hook para estoque
export const useStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStock = async (productId: number, quantity: number, operation: 'add' | 'subtract') => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.updateStock(productId, { quantity, operation });
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar estoque');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLowStockReport = async (quantity?: number) => {
    setLoading(true);
    setError(null);
    try {
      const report = await apiService.getLowStockReport(quantity);
      return report;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório de estoque baixo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStockReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await apiService.getStockReport();
      return report.statistics;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório de estoque');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateStock,
    getLowStockReport,
    getStockReport,
  };
};

// Hook para usuários
export const useUsers = () => {
  const [users, setUsers] = useState<{ id_usuario: number; nome: string, email: string, tipo_usuario: UserType }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: { limit?: number; page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUsers({ limit: 100, ...params });
      setUsers(response as unknown as { id_usuario: number; nome: string, email: string, tipo_usuario: UserType }[]);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, user: { name: string; email: string; newPassword: string; userType: UserType }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await apiService.updateUser(id, user);
      setUsers(prev => prev.map(user => user.id_usuario === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id_usuario !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUsersReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await apiService.getUsersReport();
      return report;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar relatório');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    getUsersReport,
  };
};