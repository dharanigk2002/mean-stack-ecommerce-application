import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../services/cart.service';
import type { CartModel } from '../../types/cart.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
})
export class Cart {
  cartService = inject(CartService);
  destroyRef = inject(DestroyRef);

  constructor() {
    const subscription = this.cartService.quantityErrors.subscribe({
      next(error: Error) {
        console.error('[ERROR]', error.message);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  cartItems = this.cartService.cartItems;

  subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + this.getItemPrice(item) * item.quantity, 0),
  );
  totalItems = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));

  getItemPrice(item: CartModel) {
    return item.productId.price * (1 - item.productId.discount / 100);
  }

  increaseQuantity(item: CartModel) {
    this.cartService.updateCartQuantity(item.productId, 1);
  }

  decreaseQuantity(item: CartModel) {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateCartQuantity(item.productId, -1);
  }

  removeItem(item: CartModel) {
    if (!window.confirm('Are you sure want to remove this item from cart?')) return;

    this.cartService.removeFromCart(item.productId).subscribe({
      next: window.alert,
    });
  }
}
