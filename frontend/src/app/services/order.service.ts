import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderModel, ShippingAddress } from '../types/order.model';
import { ResponseModel } from '../types/response.model';
import { catchError, map, throwError } from 'rxjs';
import { Pagination } from '../types/product.model';
import { Status } from '../components/admin-orders/admin-orders';

const API_URL = environment.apiUrl + '/api/orders';

@Service()
export class OrderService {
  private readonly httpClient = inject(HttpClient);

  placeOrder(shippingAddress: ShippingAddress, paymentType: 'cash' | 'card') {
    return this.httpClient
      .post<ResponseModel<{ order: OrderModel }>>(API_URL, {
        shippingAddress,
        paymentType,
      })
      .pipe(
        map((res) => {
          window.alert(res.message);
          return res.data.order;
        }),
        catchError((err) => throwError(() => new Error(err.error.message, { cause: err.error }))),
      );
  }

  getOrders() {
    return this.httpClient.get<ResponseModel<{ orders: OrderModel[] }>>(API_URL).pipe(
      map((res) => {
        return res.data.orders;
      }),
      catchError((err) => throwError(() => new Error(err.error.message, { cause: err.error }))),
    );
  }

  getAdminOrders({ page, pageSize = 4 }: { page: number; pageSize?: number }) {
    return this.httpClient
      .get<ResponseModel<{ orders: OrderModel[]; pagination: Pagination }>>(API_URL + '/admin', {
        params: {
          page,
          pageSize,
        },
      })
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => new Error(err.error?.message, { cause: err.error }))),
      );
  }

  updateOrderStatus(orderId: string, status: Status) {
    return this.httpClient
      .put<ResponseModel<{ order: OrderModel }>>(API_URL + '/admin', {
        orderId,
        status,
      })
      .pipe(
        catchError((err) => throwError(() => new Error(err.error?.message, { cause: err.error }))),
      );
  }
}
