import { api } from './api';
import { Inventory, PaginatedResponse } from '@/types';

export interface InventoryQuery {
  product?: string;
  supplier?: string;
  type?: string;
  batchNo?: string;
  relatedType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateInventoryRequest {
  product: string;
  supplier?: string;
  type: 'in' | 'out' | 'adjust' | 'transfer';
  quantity: number;
  batchNo?: string;
  relatedOrder?: string;
  relatedType?: string;
  remark?: string;
}

export const inventoryApi = {
  getAll: async (params: InventoryQuery): Promise<PaginatedResponse<Inventory>> => {
    const response = await api.get<PaginatedResponse<Inventory>>('/inventory', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Inventory> => {
    const response = await api.get<Inventory>(`/inventory/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryRequest): Promise<Inventory> => {
    const response = await api.post<Inventory>('/inventory', data);
    return response.data;
  },

  getProductHistory: async (productId: string, params?: any): Promise<PaginatedResponse<Inventory>> => {
    const response = await api.get<PaginatedResponse<Inventory>>(`/inventory/product/${productId}/history`, { params });
    return response.data;
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/inventory/statistics');
    return response.data;
  },
};