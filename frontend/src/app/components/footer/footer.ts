import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = new Date().getFullYear();

  shopLinks = [
    {
      name: 'All Products',
      route: '/products',
    },
    {
      name: 'Categories',
      route: '/categories',
    },
    {
      name: 'Deals',
      route: '/deals',
    },
    {
      name: 'New Arrivals',
      route: '/new-arrivals',
    },
  ];

  serviceLinks = [
    {
      name: 'My Account',
      route: '/profile',
    },
    {
      name: 'My Orders',
      route: '/orders',
    },
    {
      name: 'Track Order',
      route: '/orders',
    },
    {
      name: 'Returns & Refunds',
      route: '/returns',
    },
  ];
}
