import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Auth, AuthData, LoginResponse } from '../models/auth.model';
import { AuthAdapter } from './adapters';
import { LocalKeys, LocalManagerService } from './local-manager.service';
import { Router } from '@angular/router';
import { appRoutes } from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:4000/auth';
  
  http: HttpClient = inject(HttpClient);
  localManager = inject(LocalManagerService);
  router = inject(Router);

  login(user: AuthData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user).pipe(
      map(AuthAdapter),
      tap(auth => {
        this.localManager.setElement(LocalKeys.accesToken, auth.accesToken);
        this.localManager.setElement(LocalKeys.refreshToken, auth.refreshToken);
      }));
  }

  register(user: AuthData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, user);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.localManager.getElement(LocalKeys.refreshToken);

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
    
    return this.http.post<{refreshToken: string}>(`${this.baseUrl}/token`, { refreshToken })
    .pipe(
      map((response) => response.refreshToken),
      tap((newAccesToken) => {
        this.localManager.setElement(LocalKeys.accesToken, newAccesToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.localManager.clearStorage();
    this.router.navigate([appRoutes.public.login], { replaceUrl: true });
  }
}
