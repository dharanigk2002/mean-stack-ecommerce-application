import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { ResolveFn, RouterLink } from '@angular/router';

import { map } from 'rxjs';
import { BrandService } from '../../../services/brand.service';
import type { Brand } from '../../../types/brand.model';

@Component({
  selector: 'table-overview-example',
  styleUrl: 'brands.scss',
  templateUrl: 'brands.html',
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
export class Brands implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  brands = input.required<Brand[]>();

  private readonly brandService = inject(BrandService);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<Brand>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.brands();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(categoryId: string) {
    if (!confirm('Are you sure want to delete this brand ' + categoryId)) return;
    const subscription = this.brandService.deleteBrand(categoryId).subscribe({
      next: (data) => {
        this.dataSource.data = this.dataSource.data.filter((data) => data.id !== categoryId);
        window.alert(data.message);
      },
      error(err) {
        alert(err.message);
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}

export const resolveBrands: ResolveFn<Brand[]> = () => {
  const brandsService = inject(BrandService);
  return brandsService.getBrands().pipe(map((data) => data.brands));
};
