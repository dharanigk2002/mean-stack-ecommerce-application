import { Product } from './product.model';

export interface CartModel {
  id: string;
  productId: Product;
  quantity: number;
}
