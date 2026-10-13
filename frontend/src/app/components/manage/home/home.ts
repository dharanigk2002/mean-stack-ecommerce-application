import { Component, effect, inject, viewChild } from '@angular/core';
import { ResolveFn, RouterOutlet } from '@angular/router';
import { Product } from '../../../types/product.model';
import { map } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  imports: [Header, Footer, RouterOutlet],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  header = viewChild.required<Header>('header');
  marginTop = 0;

  constructor() {
    effect(() => {
      this.marginTop = this.header().header().nativeElement.offsetHeight;
    });
  }
}

export const resolveNewProduct: ResolveFn<Product[]> = () => {
  const customerService = inject(CustomerService);
  return customerService.getNewProducts().pipe(map((data) => data.products));
};

export const resolveFeaturedProduct: ResolveFn<Product[]> = () => {
  const customerService = inject(CustomerService);
  return customerService.getFeaturedProducts().pipe(map((data) => data.products));
};
