import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Category } from '../types/category.model';
import { catchError, map, throwError } from 'rxjs';
import type { ResponseModel } from '../types/response.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories() {
    return this.http.get<ResponseModel<{ categories: Category[] }>>(`${API_URL}/api/category`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
      map((res) => res.data),
    );
  }

  getCategory(categoryId: string) {
    return this.http
      .get<ResponseModel<{ category: Category }>>(`${API_URL}/api/category/${categoryId}`)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
        map((res) => res.data.category),
      );
  }

  addCategory(name: string) {
    return this.http
      .post<ResponseModel<{ category: Category }>>(`${API_URL}/api/category`, {
        name,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
        map((res) => res.data),
      );
  }

  deleteCategory(categoryId: string) {
    return this.http.delete<ResponseModel<null>>(`${API_URL}/api/category/${categoryId}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
    );
  }

  updateCategory(category: Category) {
    return this.http.put<ResponseModel<{ category: Category }>>(
      `${API_URL}/api/category/${category.id}`,
      { name: category.name },
    );
  }
}
