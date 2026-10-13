import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderModel } from '../../types/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './user-orders.html',
})
export class UserOrders implements OnInit {
  private readonly orderService = inject(OrderService);

  orders = signal<OrderModel[]>([]);
  loading = signal(true);
  error = signal('');
  isOpened = signal<boolean[]>([]);

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isOpened.set(Array(orders.length).fill(false));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load your orders. Please try again.');
        this.loading.set(false);
      },
    });
  }

  onOpen(index: number) {
    this.isOpened.set(this.isOpened().map((open, ind) => (ind === index ? !open : open)));
  }

  trackOrder(index: number, order: OrderModel): string {
    return order.id;
  }
}
