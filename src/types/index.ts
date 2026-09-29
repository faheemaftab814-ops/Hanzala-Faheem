export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in PKR
  compareAtPrice?: number;
  images: string[];
  colors: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  category: string;
  capacity?: string;
  material?: string;
  temperatureRetention?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid';

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  city: string;
  shippingAddress: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharges: number;
  finalTotal: number;
  paymentMethod: 'Cash on Delivery (COD)';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  address?: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerId?: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  whatsappNumber: string;
  currency: string;
  shippingCharges: number;
  freeShippingThreshold: number;
  announcementText: string;
  returnPolicy: string;
  shippingPolicy: string;
  updatedAt?: string;
}
