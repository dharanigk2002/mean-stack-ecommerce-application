import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';
import { MatOption, MatSelectModule, MatSelectTrigger } from '@angular/material/select';

@Component({
  imports: [MatFormField, MatLabel, MatInput, MatAnchor, FormsModule],
  selector: 'app-category-form',
  templateUrl: './category-form.html',
})
export class CategoryForm {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly categoryName = input<string>('', { alias: 'category-name' });
  readonly id = input<string>('');

  name = signal<string>('');
  invalid = computed(() => this.name().length < 2);

  constructor() {
    effect(() => this.categoryName() && this.name.set(this.categoryName()));
  }

  onSubmit() {
    if (this.invalid()) return;
    if (!this.id()) {
      this.categoryService.addCategory(this.name()).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['admin', 'categories'], { replaceUrl: true });
          this.name.set('');
        },
        error(err) {
          alert(err.message);
        },
      });
      return;
    }
    this.categoryService.updateCategory({ id: this.id(), name: this.name() }).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['admin', 'categories'], { replaceUrl: true });
        this.name.set('');
      },
      error(err) {
        alert(err.message);
      },
    });
  }
}
