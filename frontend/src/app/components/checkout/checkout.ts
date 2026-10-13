import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderModel, ShippingAddress } from '../../types/order.model';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.html',
})
export class Checkout {
  address: ShippingAddress = {
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  };
  paymentMethod: 'cash' | 'card' = 'cash';

  orderService = inject(OrderService);
  cartService = inject(CartService);
  router = inject(Router);

  continueCheckout(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.orderService.placeOrder(this.address, this.paymentMethod).subscribe({
      error(err) {
        console.error(err.message);
        window.alert(err.message);
      },
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['orders'], {
          replaceUrl: true,
        });
      },
    });
  }
}
