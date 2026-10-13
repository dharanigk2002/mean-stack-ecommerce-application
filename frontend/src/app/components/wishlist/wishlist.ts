import { Component, inject } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  imports: [ProductCard],
  selector: 'app-wishlist',
  templateUrl: './wishlist.html',
})
export class Wishlist {
  wishlistItems = inject(WishlistService).wishlist;
}
