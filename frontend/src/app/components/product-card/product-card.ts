import { Component, input, inject, computed } from '@angular/core';
import { Product } from '../../types/product.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carousel } from '../carousel/carousel';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [CurrencyPipe, RouterLink, Carousel],
  selector: 'app-product-card',
  templateUrl: './product-card.html',
})
export class ProductCard {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  product = input.required<Product>();

  isAdmin = this.authService.user()?.isAdmin;

  isWishlisted = computed(() =>
    this.wishlistService.wishlist().some((product) => product.id === this.product().id),
  );
  isInCart = computed(() =>
    this.cartService.cartItems().some((item) => item.productId.id === this.product().id),
  );

  onWishlist(event: Event) {
    event.stopPropagation();
    if (this.isWishlisted()) {
      this.wishlistService.deleteWishlist(this.product()).subscribe({
        error(err: Error) {
          console.error(err.message);
        },
      });
    } else {
      this.wishlistService.createWishlist(this.product()).subscribe({
        error(err: Error) {
          console.error(err.message);
        },
      });
    }
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.product()).subscribe({
      error(err: Error) {
        window.alert(err.message);
      },
    });
  }

  onRemoveFromCart(event: Event) {
    event.stopPropagation();
    this.cartService.removeFromCart(this.product()).subscribe({
      error(err: Error) {
        window.alert(err.message);
      },
    });
  }
}
