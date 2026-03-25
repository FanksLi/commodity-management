import { api } from './api';
import { Order, PaginatedResponse } from '@/types';

export interface OrderQuery {
  orderNo?: string;
  type?: string;
  status?: string;
  supplier?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderRequest {
  type: 'purchase' | 'sale' | 'return';
  supplier?: string;
  items: {
    product: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    remark?: string;
  }[];
  discountAmount?: number;
  remark?: string;
  shippingInfo?: {
    receiver?: string;
    phone?: string;
    address?: string;
    trackingNo?: string;
  };
}

export const orderApi = {
  getAll: async (params: OrderQuery): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateOrderRequest>): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  getStatistics: async (): Promise<any> => {
    const response = await api.get('/orders/statistics');
    return response.data;
  },
};