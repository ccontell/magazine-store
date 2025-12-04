export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[]; // New: Array of images
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  description: string;
  specifications: Record<string, string>; // New: Technical specs
  features: string[];
  stock: number; // New: Available stock quantity
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 
  | 'Todos' 
  | 'Smartphones' 
  | 'Eletrodomésticos' 
  | 'Informática' 
  | 'Móveis' 
  | 'TV e Vídeo'
  | 'Games'
  | 'Beleza e Perfumaria'
  | 'Esporte e Lazer'
  | 'Moda'
  | 'Automotivo';

export type SortOption = 'lowest' | 'highest' | 'rating';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type NotificationType = 'success' | 'info' | 'promotion' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  image?: string;
  productId?: number; // Added to link notification to product
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix';

export interface PaymentDetails {
  cardNumber?: string;
  cardHolder?: string;
  cardCpf?: string;
  expiry?: string;
  cvv?: string;
  installmentsSummary?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod; 
  installments?: string; // Legacy string for simple view
  paymentDetails?: PaymentDetails; // New detailed object
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin'; // Added role
  cpf?: string; // Added for validation
}