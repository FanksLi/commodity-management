export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  roles: string[];
  avatar?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  parent?: string;
  level: number;
  sort: number;
  isActive: boolean;
  children?: Category[];
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string | Category;
  brand?: string;
  model?: string;
  description?: string;
  images: string[];
  attributes: Record<string, any>;
  specifications: Record<string, any>;
  variants?: ProductVariant[];
  costPrice: number;
  sellingPrice: number;
  marketPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: 'draft' | 'pending' | 'active' | 'inactive';
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
  stock?: number;
}

export interface Supplier {
  _id: string;
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
  categories: string[];
  level: 'A' | 'B' | 'C' | 'D';
  isActive: boolean;
  remark?: string;
}

export interface Inventory {
  _id: string;
  product: string | Product;
  supplier?: string | Supplier;
  type: 'in' | 'out' | 'adjust' | 'transfer';
  quantity: number;
  beforeStock: number;
  afterStock: number;
  batchNo?: string;
  relatedOrder?: string;
  relatedType?: string;
  remark?: string;
  operator?: string | User;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  type: 'purchase' | 'sale' | 'return';
  supplier?: string | Supplier;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  remark?: string;
  shippingInfo?: {
    receiver?: string;
    phone?: string;
    address?: string;
    trackingNo?: string;
  };
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  remark?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}