import { Component, effect, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WishlistService } from './services/wishlist.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  constructor() {
    this.wishlistService.wishlists().subscribe({
      error: (err: Error) => console.error(err.message),
    });
    this.cartService.fetchCartItems().subscribe({
      error: (err: Error) => console.error(err.message),
    });
  }
}
