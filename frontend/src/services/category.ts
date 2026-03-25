import { api } from './api';
import { Category, PaginatedResponse } from '@/types';

export interface CategoryQuery {
  name?: string;
  parent?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent?: string;
  sort?: number;
  isActive?: boolean;
}

export const categoryApi = {
  getAll: async (params: CategoryQuery): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  getTree: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories/tree');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};