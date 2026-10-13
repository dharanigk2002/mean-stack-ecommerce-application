import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category.model';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  header = viewChild.required<ElementRef<HTMLElement>>('header');
  clientUrl = environment.clientUrl;
  apiUrl = environment.apiUrl;

  authService = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  router = inject(Router);
  cartService = inject(CartService);

  categories = signal<Category[]>([]);
  search = input('');

  quantity = computed(() =>
    this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0),
  );

  user = this.authService.user();

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data.categories);
      },
    });
  }

  onSearch(e: Event) {
    const search = (new FormData(e.target as HTMLFormElement).get('search') as string) ?? undefined;
    const queryParams: Record<string, string | null | undefined> = { search, page: null };
    if (!search) queryParams['search'] = undefined;
    this.router.navigate(['/products'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error(err) {
        window.alert(err.message);
      },
    });
  }
}
