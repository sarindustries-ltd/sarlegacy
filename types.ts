
export interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  description: string;
  rating: number;
  featured?: boolean;
  video?: string;
  stock: number;
  tags?: string[];
}

export enum ProductCategory {
  ALL = 'All',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home',
  ACCESSORIES = 'Accessories'
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    isAdmin?: boolean;
    memberSince: string;
    rank?: string;
    credits?: number;
    tierProgress?: number;
    lastLogin: string;
    totalSpent: number;
}

export interface Order {
    id: string;
    userId: number;
    date: string;
    items: { productId: number; name: string; quantity: number }[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    customerName: string;
    shippingAddress: string;
}