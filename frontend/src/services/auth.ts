import { api } from './api';
import { User } from '@/types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};