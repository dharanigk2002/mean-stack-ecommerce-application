import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginRedirect = () =>
    router.createUrlTree(['/login'], {
      queryParams: {
        'return-url': state.url,
      },
    });

  return authService.checkAuth().pipe(
    map(() => true),
    catchError(() => of(loginRedirect())),
  );
};

export const adminGuard: CanActivateFn = (_router, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loginRedirect = () =>
    router.createUrlTree(['/login'], {
      queryParams: {
        'return-url': state.url,
      },
    });
  return authService.checkAuth().pipe(
    map((user) => (user.isAdmin ? true : router.createUrlTree(['/']))),
    catchError(() => [loginRedirect()]),
  );
};
