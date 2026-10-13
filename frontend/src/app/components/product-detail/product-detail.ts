import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ResolveFn, RouterLink } from '@angular/router';
import type { Product } from '../../types/product.model';
import { ProductsService } from '../../services/product.service';
import { Carousel } from '../carousel/carousel';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { WishlistService } from '../../services/wishlist.service';
import type { ProductDetail as ProductDetailType } from '../../types/product.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [Carousel, CurrencyPipe, RouterLink, ProductCard, DatePipe],
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
})
export class ProductDetail implements AfterViewChecked {
  destroyRef = inject(DestroyRef);
  productService = inject(ProductsService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  // quantity = signal(1);
  similarProducts = signal<Product[]>([]);

  isAdmin = inject(AuthService).user()?.isAdmin;

  isInCart = computed(() =>
    this.cartService.cartItems().some((item) => item.productId.id === this.product().id),
  );

  product = input.required<ProductDetailType>();
  addToCart = output<{ product: Product; quantity: number }>();

  category = computed(() => this.product().categoryId.name);
  brand = computed(() => this.product().brandId.name);

  isWishlisted = computed(() =>
    this.wishlistService.wishlist().some((product) => product.id === this.product().id),
  );

  ngAfterViewChecked() {
    this.productService
      .getProducts({ categoryId: this.product().categoryId.id, page: 1, pageSize: 4 })
      .subscribe({
        next: (data) =>
          this.similarProducts.set(
            data.products.filter((product) => product.id !== this.product().id),
          ),
      });
  }

  discountedPrice = computed(() => {
    const product = this.product();
    return product.price * (1 - product.discount / 100);
  });

  /*increaseQuantity() {
    this.quantity.update((q) => q + 1);
  }

  decreaseQuantity() {
    this.quantity.update((q) => Math.max(1, q - 1));
  }*/

  onWishlist() {
    if (!this.isWishlisted()) {
      this.wishlistService.createWishlist(this.product() as unknown as Product).subscribe({
        error(err: Error) {
          console.error(err.message);
        },
      });
    } else {
      this.wishlistService.deleteWishlist(this.product() as unknown as Product).subscribe({
        error(err: Error) {
          console.error(err.message);
        },
      });
    }
  }

  onAddToCart() {
    if (this.isInCart()) {
      this.onRemoveFromCart();
      return;
    }
    this.cartService.addToCart(this.product() as unknown as Product).subscribe({
      error(err: Error) {
        window.alert(err.message);
      },
    });
  }

  onRemoveFromCart() {
    this.cartService.removeFromCart(this.product() as unknown as Product).subscribe({
      error(err: Error) {
        window.alert(err.message);
      },
    });
  }
}

export const reolveProduct: ResolveFn<ProductDetailType> = (route) => {
  const productsService = inject(ProductsService);
  const id = route.params['id'];
  return productsService.getProduct(id);
};
