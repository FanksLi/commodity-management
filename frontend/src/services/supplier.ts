import { api } from './api';
import { Supplier, PaginatedResponse } from '@/types';

export interface SupplierQuery {
  name?: string;
  contact?: string;
  phone?: string;
  level?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateSupplierRequest {
  name: string;
  code?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  bankInfo?: {
    bank?: string;
    account?: string;
    accountName?: string;
  };
  taxNumber?: string;
  categories?: string[];
  level?: string;
  isActive?: boolean;
  remark?: string;
}

export const supplierApi = {
  getAll: async (params: SupplierQuery): Promise<PaginatedResponse<Supplier>> => {
    const response = await api.get<PaginatedResponse<Supplier>>('/suppliers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await api.post<Supplier>('/suppliers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSupplierRequest>): Promise<Supplier> => {
    const response = await api.patch<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/suppliers/statistics');
    return response.data;
  },
};