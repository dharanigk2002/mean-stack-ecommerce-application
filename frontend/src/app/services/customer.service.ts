import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../types/response.model';
import { Product } from '../types/product.model';
import { environment } from '../../environments/environment';
import { catchError, map, throwError } from 'rxjs';

const API_URL = environment.apiUrl + '/api/customer/home';

@Service()
export class CustomerService {
  http = inject(HttpClient);

  getNewProducts() {
    return this.http.get<ResponseModel<{ products: Product[] }>>(`${API_URL}/new`).pipe(
      catchError((error) => throwError(() => new Error(error.error.message, { cause: error }))),
      map((response) => response.data),
    );
  }

  getFeaturedProducts() {
    return this.http.get<ResponseModel<{ products: Product[] }>>(`${API_URL}/featured`).pipe(
      catchError((error) => throwError(() => new Error(error.message, { cause: error }))),
      map((response) => response.data),
    );
  }
}
