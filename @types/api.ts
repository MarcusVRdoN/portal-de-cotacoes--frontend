import { AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders } from "axios";

export interface AxiosResponse<T = any, D = any> {
  data: {
    data: T;
    message: string;
    statusCode: number;
    timestamp: string;
  };
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  newPassword?: string;
  userType?: 'CLIENT' | 'ADMIN' | 'SUPPLIER';
  type?: 'CLIENT' | 'ADMIN' | 'SUPPLIER';
}

export interface Product {
  id?: number;
  productName: string;
  description: string;
  quantity: number;
}

export interface OrderItem {
  id_produto: number;
  quantidade: number;
  valor_unitario: number;
}

export interface Order {
  id?: number;
  items?: OrderItem[];
  valor_total?: number;
}

export interface OrderResponseItem {
  id_item_pedido: number;
  id_pedido: number;
  id_produto: number;
  quantidade: number;
  valor_unitario: number;
  produto: {
    nome_produto: string;
  };
}

export interface OrderResponse {
  id_pedido: number;
  data_pedido: string;
  valor_total: number;
  id_cliente: number;
  cliente: {
    nome: string;
    email: string
  };
  itens: OrderResponseItem[]
}

export interface QuoteItem {
  id_produto: number;
  quantidade: number;
}

export interface Quote {
  id?: number;
  items?: QuoteItem[];
  status?: string;
}

export interface QuoteResponse {
  supplierId: number;
  unitPrice: number;
  deliveryTime: string;
}

export interface StockUpdate {
  quantity: number;
  operation: 'add' | 'subtract';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
}

export enum UserType {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SUPPLIER = "SUPPLIER"
}