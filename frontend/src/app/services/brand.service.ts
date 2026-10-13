import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../types/response.model';
import { Brand } from '../types/brand.model';
import { catchError, map, throwError } from 'rxjs';

const API_URL = environment.apiUrl;

@Service()
export class BrandService {
  private readonly http = inject(HttpClient);

  getBrands() {
    return this.http.get<ResponseModel<{ brands: Brand[] }>>(`${API_URL}/api/brands`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
      map((res) => res.data),
    );
  }

  getBrand(brandId: string) {
    return this.http.get<ResponseModel<{ brand: Brand }>>(`${API_URL}/api/brands/${brandId}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
      map((res) => res.data.brand),
    );
  }

  addBrand(name: string) {
    return this.http
      .post<ResponseModel<{ brand: Brand }>>(`${API_URL}/api/brands`, {
        name,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.message, { cause: error }));
        }),
        map((res) => res.data),
      );
  }

  deleteBrand(brandId: string) {
    return this.http.delete<ResponseModel<null>>(`${API_URL}/api/brands/${brandId}`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message, { cause: error }));
      }),
    );
  }

  updateBrand(brand: Brand) {
    return this.http
      .put<ResponseModel<{ brand: Brand }>>(`${API_URL}/api/brands/${brand.id}`, {
        name: brand.name,
      })
      .pipe(
        catchError((err) =>
          throwError(() => new Error(err.error.message ?? 'Something went wrong', { cause: err })),
        ),
      );
  }
}
