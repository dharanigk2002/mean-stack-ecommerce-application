import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [],
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.html',
})
export class CustomerProfile {
  user = inject(AuthService).user;
}
