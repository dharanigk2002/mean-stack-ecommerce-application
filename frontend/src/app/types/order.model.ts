import type { Product } from './product.model';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderModel {
  id: string;
  items: {
    productId: Product;
    name: string;
    price: number;
    quantity: number;
  }[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentType: 'cash' | 'card';
  createdAt: Date;
  updatedAt: Date;
}
