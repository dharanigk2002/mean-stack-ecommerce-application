import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);
  serverError = signal('');

  signupForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  onSubmit() {
    if (this.signupForm.invalid || this.isSubmitting()) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.serverError.set('');
    this.isSubmitting.set(true);

    this.authService
      .register(this.signupForm.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (data) => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.serverError.set(err.message ?? 'Registration failed. Please try again.');
        },
      });
  }
}
