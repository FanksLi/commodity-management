import { api } from './api';
import { Product, PaginatedResponse } from '@/types';

export interface ProductQuery {
  keyword?: string;
  category?: string;
  brand?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  isLowStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  brand?: string;
  model?: string;
  description?: string;
  images?: string[];
  attributes?: Record<string, any>;
  specifications?: Record<string, any>;
  variants?: any[];
  costPrice?: number;
  sellingPrice?: number;
  marketPrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  status?: string;
  sort?: number;
}

export const productApi = {
  getAll: async (params: ProductQuery): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  updateStock: async (id: string, quantity: number): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/stock`, null, {
      params: { quantity },
    });
    return response.data;
  },

  batchUpdateStatus: async (ids: string[], status: string): Promise<void> => {
    await api.post('/products/batch/status', { ids, status });
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/products/statistics');
    return response.data;
  },
};