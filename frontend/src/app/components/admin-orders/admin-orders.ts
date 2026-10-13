import { Component, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { OrderModel } from '../../types/order.model';
import { OrderService } from '../../services/order.service';
import { CurrencyPipe, DatePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Pagination } from '../../types/product.model';
import { MatAnchor } from '@angular/material/button';
import { FormsModule, NgModel } from '@angular/forms';

const status = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type Status = (typeof status)[number];

@Component({
  imports: [DatePipe, TitleCasePipe, CurrencyPipe, MatAnchor, FormsModule, LowerCasePipe],
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.html',
})
export class AdminOrders {
  adminOrders = input.required<{ orders: OrderModel[]; pagination: Pagination }>();
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);

  statusOptions = status;

  nextPage() {
    const page = Number(this.activatedRoute.snapshot.queryParams['page'] || 1);
    this.router.navigate([], {
      queryParams: {
        page: page + 1,
      },
      relativeTo: this.activatedRoute,
    });
  }

  prevPage() {
    const page = Number(this.activatedRoute.snapshot.queryParams['page'] || 1);
    if (page <= 1) return;

    const nextTargetPage = page - 1;
    this.router.navigate([], {
      queryParams: {
        page: nextTargetPage === 1 ? null : nextTargetPage,
      },
      relativeTo: this.activatedRoute,
    });
  }

  isOpened = signal<boolean[]>([]);
  constructor() {
    effect(() => {
      this.isOpened.set(Array(this.adminOrders().orders.length).fill(false));
    });
  }

  handleStatus(status: Status, orderId: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      error(err) {
        window.alert(err.message);
      },
      next(value) {
        window.alert(value.message);
      },
    });
  }

  onOpen(index: number) {
    this.isOpened.set(this.isOpened().map((open, ind) => (ind === index ? !open : open)));
  }
}

export const resolveAdminOrders: ResolveFn<{
  orders: OrderModel[];
  pagination: Pagination;
}> = (activatedRoute) => {
  const page = activatedRoute.params['page'] ?? 1;

  return inject(OrderService).getAdminOrders({ page });
};
