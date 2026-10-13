import { Component, inject, input, signal } from '@angular/core';
import { ProductsService } from '../../services/product.service';
import { ProductWithPagination } from '../../types/product.model';
import { ProductCard } from '../product-card/product-card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../types/brand.model';
import { Router, ActivatedRoute, ResolveFn } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
  imports: [
    ProductCard,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAnchor,
  ],
  selector: 'app-product-list',
  templateUrl: './product-list.html',
})
export class ProductList {
  productService = inject(ProductsService);
  brandService = inject(BrandService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  productDetails = input.required<ProductWithPagination>({ alias: 'products' });
  sortOrder = input('');
  brands = input<Brand[]>([]);
  brandId = input('', { alias: 'brand-id' });

  currentPage = signal(1);

  handleChange(event: MatSelectChange, type: 'brand' | 'sort') {
    const queryParams: Record<string, string | null> = {};
    if (type === 'brand') {
      queryParams['brand-id'] = event.value || null;
      queryParams['page'] = null;
    }
    if (type === 'sort') {
      queryParams['sortOrder'] = event.value;
      queryParams['sortBy'] = 'price';
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  pageChange(page: number) {
    this.currentPage.set(page);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
  }
}

export const resolveProductQuery: ResolveFn<ProductWithPagination> = (route) => {
  const query = route.queryParams;
  const queryParams = Object.fromEntries(
    Object.entries({
      categoryId: query['category-id'],
      search: query['search'],
      brandId: query['brand-id'],
      sortBy: query['sortBy'],
      sortOrder: query['sortOrder'],
      page: query['page'],
    }).filter(([_, value]) => typeof value !== 'undefined' && value !== null && value !== ''),
  );
  return inject(ProductsService).getProducts(queryParams);
};
