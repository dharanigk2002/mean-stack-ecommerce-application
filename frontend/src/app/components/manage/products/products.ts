import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { ResolveFn, RouterLink } from '@angular/router';

import type { Pagination, Product, ProductWithPagination } from '../../../types/product.model';
import { ProductsService } from '../../../services/product.service';

@Component({
  selector: 'table-overview-example',
  templateUrl: 'products.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatAnchor,
    MatButtonModule,
    RouterLink,
  ],
})
export class Products implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  products = input.required<ProductWithPagination>();

  private readonly productService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['id', 'name', 'shortDescription', 'price', 'discount', 'action'];
  dataSource = new MatTableDataSource<Product>([]);
  pagination = signal<Pagination | undefined>(undefined);

  constructor() {
    effect(() => {
      this.dataSource.data = this.products().products;
      this.pagination.set(this.products().pagination);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent) {
    const subscription = this.productService
      .getProducts({ page: event.pageIndex + 1, pageSize: event.pageSize })
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.products;
          this.pagination.set(data.pagination);
        },
        error: (err) => alert(err.message),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onDelete(productId: string) {
    if (!confirm('Are you sure want to delete this product ' + productId)) return;
    const subscription = this.productService.deleteProduct(productId).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter((data) => data.id !== productId);
        window.alert(data.message);
      },
      error(err) {
        alert(err.message);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}

export const resolveProducts: ResolveFn<ProductWithPagination> = () => {
  const productService = inject(ProductsService);

  return productService.getProducts();
};
