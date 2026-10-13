import { DestroyRef, inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartModel } from '../types/cart.model';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../types/response.model';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
  Subject,
  throwError,
} from 'rxjs';
import { Product } from '../types/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const API_URL = environment.apiUrl + '/api/cart';

@Service()
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  #quantityChanges = new Map<string, Subject<{ quantity: number; previousItems: CartModel[] }>>();
  #quantityErrors = new Subject<Error>();
  quantityErrors = this.#quantityErrors.asObservable();

  #cartItems = signal<CartModel[]>([]);
  cartItems = this.#cartItems.asReadonly();

  clearCart() {
    this.#cartItems.set([]);
  }

  fetchCartItems() {
    return this.httpClient.get<ResponseModel<{ cart: CartModel[] }>>(API_URL).pipe(
      map((res) => {
        this.#cartItems.set(res.data.cart);
        return res.data.cart;
      }),
      catchError((err) => throwError(() => new Error(err.error.message, { cause: err.error }))),
    );
  }

  addToCart(product: Product) {
    this.#cartItems.update((prev) => [
      ...prev,
      { id: Date.now().toString(16), quantity: 1, productId: product },
    ]);
    return this.httpClient
      .post<ResponseModel<{ cart: CartModel }>>(API_URL, {
        productId: product.id,
      })
      .pipe(
        map((res) => res.data.cart),
        catchError((err) => {
          this.#cartItems.set(this.#cartItems().filter((item) => item.productId.id !== product.id));
          return throwError(() => new Error(err.error.message, { cause: err.error }));
        }),
      );
  }

  updateCartQuantity(product: Product, delta: number) {
    const productId = product.id!;
    const previousItems = this.#cartItems();
    const item = this.#cartItems().find((item) => item.productId.id === productId);
    if (!item) return;

    const nextQuantity = Math.max(1, item.quantity + delta);

    // Update UI immediately
    this.#cartItems.update((items) =>
      items.map((item) =>
        item.productId.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    );

    // Create a debounced stream for this product once
    let changes = this.#quantityChanges.get(productId);

    if (!changes) {
      changes = new Subject<{ quantity: number; previousItems: CartModel[] }>();
      this.#quantityChanges.set(productId, changes);

      changes
        .pipe(
          debounceTime(500),
          distinctUntilChanged((prev, curr) => prev.quantity === curr.quantity),

          // Serialize requests for this product
          concatMap(({ quantity, previousItems }) =>
            this.httpClient
              .put<ResponseModel<{ cart: CartModel }>>(API_URL, {
                productId,
                quantity, // Absolute quantity, not delta
              })
              .pipe(
                catchError((err) => {
                  this.#cartItems.set(previousItems);
                  this.#quantityErrors.next(
                    new Error(err.error?.message ?? 'Failed to update cart quantity'),
                  );

                  // Keep the stream alive for future clicks
                  return EMPTY;
                }),
              ),
          ),

          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }

    changes.next({ quantity: nextQuantity, previousItems });
  }

  removeFromCart(product: Product) {
    const snapshot = this.#cartItems();
    this.#cartItems.set(snapshot.filter((item) => item.productId.id !== product.id));
    return this.httpClient
      .delete<ResponseModel<null>>(API_URL, {
        body: { productId: product.id },
      })
      .pipe(
        map((res) => res.message),
        catchError((err) => {
          this.#cartItems.set(snapshot);
          return throwError(() => new Error(err.error.message, { cause: err.error }));
        }),
      );
  }
}
