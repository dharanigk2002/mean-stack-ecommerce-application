import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

const links = [
  {
    href: '/admin/categories',
    text: 'Manage Categories',
  },
  {
    href: '/admin/brands',
    text: 'Manage Brands',
  },
  {
    href: '/admin/products',
    text: 'Manage Products',
  },
  {
    href: '/admin/orders',
    text: 'Manage Orders',
  },
];

@Component({
  imports: [Header, RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  routeLinks = links;
}
