export type Role = 'USER' | 'ADMIN';
export type Gender = 'MEN' | 'WOMEN' | 'UNISEX';
export type Category = 'UPPER_WEAR' | 'LOWER_WEAR' | 'WINTER_WEAR' | 'SUMMER_WEAR' | 'ACCESSORIES';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  gender: Gender;
  category: Category;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive?: boolean;
  isFeatured: boolean;
  popularity?: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  address: Address;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface SiteTheme {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDarkMode: boolean;
}

export interface AnalyticsData {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    trend: { date: string; revenue: number }[];
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    trend: { date: string; orders: number }[];
  };
  users: {
    total: number;
    newThisMonth: number;
    trend: { date: string; users: number }[];
  };
  topProducts: { product: Product; sales: number }[];
}

export interface ProductFilters {
  gender?: Gender;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popularity' | 'price_asc' | 'price_desc';
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
