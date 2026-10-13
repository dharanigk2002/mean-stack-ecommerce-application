export interface Product {
  id?: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: string[];
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  brandId: string;
  categoryId: string;
  isFeatured: boolean;
  isNewProduct: boolean;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type ProductWithPagination = { products: Product[]; pagination: Pagination };

export interface ProductDetail extends Omit<Product, 'brandId' | 'categoryId'> {
  brandId: { id: string; name: string };
  categoryId: { id: string; name: string };
}
