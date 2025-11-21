
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
