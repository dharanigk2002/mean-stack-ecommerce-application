import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ResponseModel } from '../types/response.model';
import { User } from '../types/user.model';

const API_URL = environment.apiUrl;

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly clientUrl = environment.clientUrl;

  #user = signal<User | null>(null);
  user = this.#user.asReadonly();

  register(user: { email: string; password: string; name?: string }) {
    return this.http
      .post<ResponseModel<{ user: User }>>(`${API_URL}/api/auth/register`, user)
      .pipe(catchError((err) => throwError(() => new Error(err.error.message))));
  }

  login(user: { email: string; password: string }) {
    return this.http.post<ResponseModel<{ user: User }>>(`${API_URL}/api/auth/login`, user).pipe(
      catchError((err) => throwError(() => new Error(err.error.message))),
      map((user) => user.data.user),
    );
  }

  checkAuth() {
    return this.http.get<ResponseModel<{ user: User }>>(`${API_URL}/api/auth/me`).pipe(
      map((res) => {
        this.#user.set(res.data.user);
        return res.data.user;
      }),
      catchError((err) => throwError(() => new Error(err.error.message))),
    );
  }

  logout() {
    return this.http
      .get(`${API_URL}/api/auth/logout`)
      .pipe(catchError((err) => throwError(() => new Error(err.error.message, { cause: err }))));
  }
}
