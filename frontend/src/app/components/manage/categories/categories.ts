import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { ResolveFn, RouterLink } from '@angular/router';

import { Category } from '../../../types/category.model';
import { CategoryService } from '../../../services/category.service';
import { map } from 'rxjs';

@Component({
  selector: 'table-overview-example',
  templateUrl: 'categories.html',
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
export class Categories implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories = input.required<Category[]>();

  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<Category>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.categories();
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
    if (!confirm('Are you sure want to delete this category ' + categoryId)) return;
    const subscription = this.categoryService.deleteCategory(categoryId).subscribe({
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

export const resolveCategories: ResolveFn<Category[]> = () => {
  const categoryService = inject(CategoryService);

  return categoryService.getCategories().pipe(map((data) => data.categories));
};
