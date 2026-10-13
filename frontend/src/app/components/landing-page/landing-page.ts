import { Component, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../types/product.model';

@Component({
  imports: [ProductCard],
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  newProduct = input.required<Product[]>();
  featuredProduct = input.required<Product[]>();
}
