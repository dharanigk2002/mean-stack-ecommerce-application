import { inject, Service, signal } from '@angular/core';
import { Product } from '../types/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../types/response.model';
import { catchError, map, throwError } from 'rxjs';

const API_URL = environment.apiUrl + '/api/wishlists';

@Service()
export class WishlistService {
  #wishlist = signal<Product[]>([]);
  private readonly httpClient = inject(HttpClient);

  wishlist = this.#wishlist.asReadonly();

  wishlists() {
    return this.httpClient
      .get<ResponseModel<{ wishlist: { productsId: Product[]; userId: string } }>>(API_URL)
      .pipe(
        map((res) => {
          this.#wishlist.set(res.data.wishlist?.productsId ?? []);
          return res.data.wishlist?.productsId ?? [];
        }),
        catchError((err) => {
          console.error(err);
          return throwError(
            () => new Error(err.error?.message ?? 'Something went wrong', { cause: err.error }),
          );
        }),
      );
  }

  createWishlist(product: Product) {
    this.#wishlist.update((list) => [...list, product]);
    return this.httpClient
      .post<ResponseModel<{ productsId: Product[]; userId: string }>>(API_URL, {
        productId: product.id,
      })
      .pipe(
        map((res) => res.data.productsId),
        catchError((err) => {
          this.#wishlist.update((list) => list.filter((prod) => prod.id !== product.id));
          return throwError(
            () => new Error(err.error.message ?? 'Something went wrong', { cause: err.error }),
          );
        }),
      );
  }

  deleteWishlist(product: Product) {
    this.#wishlist.set(this.#wishlist().filter((prod) => prod.id !== product.id));
    return this.httpClient
      .delete<ResponseModel<{ productsId: Product[]; userId: string }>>(API_URL, {
        body: {
          productId: product.id,
        },
      })
      .pipe(
        map((res) => res.data.productsId),
        catchError((err) => {
          this.#wishlist.update((prev) => [...prev, product]);
          return throwError(
            () => new Error(err.error.message ?? 'Something went wrong', { cause: err.error }),
          );
        }),
      );
  }
}
