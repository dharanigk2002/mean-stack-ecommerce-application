import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';

@Component({
  imports: [MatFormField, MatLabel, MatInput, MatAnchor, FormsModule],
  selector: 'app-category-form',
  templateUrl: './brand-form.html',
})
export class BrandForm {
  private readonly brandService = inject(BrandService);
  private readonly router = inject(Router);

  readonly brandName = input<string>('', { alias: 'brand-name' });
  readonly id = input<string>('');

  name = signal<string>('');
  invalid = computed(() => this.name().length < 2);

  constructor() {
    effect(() => this.brandName() && this.name.set(this.brandName()));
  }

  onSubmit() {
    if (this.invalid()) return;
    if (!this.id()) {
      this.brandService.addBrand(this.name()).subscribe({
        next: () => {
          this.router.navigate(['admin', 'brands'], { replaceUrl: true });
          this.name.set('');
        },
        error(err) {
          alert(err.message);
        },
      });
      return;
    }
    this.brandService.updateBrand({ id: this.id(), name: this.name() }).subscribe({
      next: () => {
        this.router.navigate(['admin', 'brands'], { replaceUrl: true });
        this.name.set('');
      },
      error(err) {
        alert(err.message);
      },
    });
  }
}
