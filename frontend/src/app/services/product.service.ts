import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Product, ProductDetail, ProductWithPagination } from '../types/product.model';
import { environment } from '../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { ResponseModel } from '../types/response.model';

const API_URL = environment.apiUrl;

@Service()
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts(
    productParams: {
      search?: string;
      categoryId?: string;
      sortBy?: string;
      sortOrder?: number;
      pageSize?: number;
      page?: number;
    } = {},
  ) {
    return this.http
      .get<ResponseModel<ProductWithPagination>>(`${API_URL}/api/products`, {
        params: productParams,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
        map((res) => res.data),
      );
  }

  getProduct(id: string) {
    return this.http
      .get<ResponseModel<{ product: ProductDetail }>>(`${API_URL}/api/products/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
        map((res) => res.data.product),
      );
  }

  addProduct(product: Product) {
    return this.http
      .post<ResponseModel<{ product: Product }>>(`${API_URL}/api/products`, {
        ...product,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
      );
  }

  deleteProduct(productId: string) {
    return this.http.delete<ResponseModel<null>>(`${API_URL}/api/products/${productId}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
    );
  }

  updateProduct(product: Partial<Product>) {
    return this.http.patch<ResponseModel<{ product: Product }>>(
      `${API_URL}/api/products/${product.id}`,
      { ...product },
    );
  }
}
