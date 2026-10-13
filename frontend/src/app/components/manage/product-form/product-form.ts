import { Component, effect, inject, input, model, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../../services/product.service';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Category } from '../../../types/category.model';
import { Brand } from '../../../types/brand.model';
import { Product } from '../../../types/product.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import type { ProductDetail } from '../../../types/product.model';

const validateImages: ValidatorFn = (control: AbstractControl) => {
  const image = control as FormControl;
  if (!image.value) return null;
  return !/^https?:\/\/.+/.test(image.value) ? { isValidImage: false } : null;
};

@Component({
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatAnchor,
    ReactiveFormsModule,
    MatOption,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
  ],
  selector: 'app-product-form',
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly productService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);

  product = input<ProductDetail>();

  readonly productName = input<string>('', { alias: 'product-name' });
  readonly id = input<string>('');
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    shortDescription: new FormControl('', {
      validators: [Validators.required, Validators.minLength(10)],
    }),
    description: new FormControl('', {
      validators: [Validators.required, Validators.minLength(50)],
    }),
    brandId: new FormControl('', {
      validators: [Validators.required],
    }),
    price: new FormControl('', {
      validators: [Validators.required],
    }),
    discount: new FormControl('', {
      validators: [Validators.required, Validators.min(0)],
    }),
    categoryId: new FormControl('', {
      validators: [Validators.required],
    }),
    images: new FormArray([]),
    isFeatured: new FormControl(false),
    isNewProduct: new FormControl(false),
  });

  constructor() {
    this.addImage();
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands.set(data.brands);
      },
    });
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data.categories);
      },
    });
    effect(() => {
      this.form.patchValue({
        name: this.product()?.name,
        shortDescription: this.product()?.shortDescription,
        description: this.product()?.description,
        price: this.product()?.price.toString(),
        discount: this.product()?.discount.toString(),
        brandId: this.product()?.brandId.id,
        categoryId: this.product()?.categoryId.id,
        isFeatured: this.product()?.isFeatured,
        isNewProduct: this.product()?.isNewProduct,
      });
      this.images.clear();
      this.product()?.images.forEach((img) =>
        this.images.push(new FormControl(img, { validators: [validateImages] })),
      );
    });
  }

  addImage() {
    this.images.push(new FormControl('', { validators: [validateImages] }));
  }

  removeImage() {
    this.images.removeAt(-1);
  }

  get images() {
    return this.form.get('images') as FormArray;
  }

  onSubmit() {
    if (!this.id()) {
      this.productService.addProduct(this.form.value as any).subscribe({
        next: (data) => {
          this.router.navigate(['admin', 'products'], { replaceUrl: true });
          this.form.reset();
          window.alert(data.message);
        },
        error(err) {
          alert(err.message);
        },
      });
      return;
    }

    const updatedValues: Partial<Product> = {};

    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (key === 'images') {
        return;
      }
      const productKey = key as keyof Product;

      if (control.value != this.product()?.[productKey])
        (updatedValues as any)[productKey] = control.value;
    });

    const currentImages = this.images.value;
    const originalImages = this.product()?.images ?? [];

    if (JSON.stringify(currentImages) !== JSON.stringify(originalImages))
      updatedValues['images'] = currentImages;
    updatedValues['id'] = this.product()?.id;
    this.productService.updateProduct(updatedValues).subscribe({
      complete: () => {
        this.router.navigate(['admin', 'products'], { replaceUrl: true });
        this.form.reset();
      },
      error(err) {
        alert(err.message);
      },
    });
  }
}

export const resolveEditProduct: ResolveFn<ProductDetail> = (activatedRoute) => {
  const productService = inject(ProductsService);
  const productId = activatedRoute.params['id'];
  return productService.getProduct(productId);
};
