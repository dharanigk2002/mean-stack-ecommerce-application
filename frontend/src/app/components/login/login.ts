import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  returnUrl = input('', { alias: 'return-url' });

  isSubmitting = signal(false);
  serverError = signal('');

  loginForm = new FormGroup({
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
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.serverError.set('');
    this.isSubmitting.set(true);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl() || '/'),
        error: (err) => {
          this.serverError.set(
            err instanceof Error ? err.message : 'Login failed. Please try again.',
          );
        },
      });
  }
}
