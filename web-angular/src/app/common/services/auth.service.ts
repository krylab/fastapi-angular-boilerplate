import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_DATA_KEY = 'userData';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private currentUserSubject = new BehaviorSubject<JwtPayload | null>(this.getCurrentUserFromToken());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  /**
   * Authenticate user with email and password
   */
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    return this.http.post<any>(`${environment.apiUrl}/auth/login`, loginData).pipe(
      tap(response => {
        if (response.access_token) {
          this.setTokens(response.access_token, response.refresh_token);
          this.updateAuthState();
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        if (response.access_token) {
          this.setTokens(response.access_token, response.refresh_token);
          this.updateAuthState();
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh the access token using refresh token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<any>(`${environment.apiUrl}/auth/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap(response => {
          if (response.access_token) {
            this.setTokens(response.access_token, response.refresh_token || refreshToken);
            this.updateAuthState();
          }
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user and clear all stored data
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);

    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get user roles from the current token
   */
  getRoles(): string[] {
    const user = this.getCurrentUserFromToken();
    return user?.role || [];
  }

  /**
   * Get current user data from token
   */
  getCurrentUser(): JwtPayload | null {
    return this.getCurrentUserFromToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRoles = this.getRoles();
    return userRoles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Private method to set tokens in localStorage
   */
  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    // Store user data for easy access
    const userData = this.decodeToken(accessToken);
    if (userData) {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  /**
   * Private method to check if current token is valid
   */
  private hasValidToken(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload) {
        return false;
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  /**
   * Private method to decode JWT token
   */
  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Private method to get current user from stored token
   */
  private getCurrentUserFromToken(): JwtPayload | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    return this.decodeToken(token);
  }

  /**
   * Private method to update authentication state
   */
  private updateAuthState(): void {
    const isAuthenticated = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.currentUserSubject.next(this.getCurrentUserFromToken());
  }

  /**
   * Private method to check token validity and auto-logout if expired
   */
  private checkTokenValidity(): void {
    if (!this.hasValidToken() && this.getAccessToken()) {
      // Token exists but is invalid/expired, try to refresh or logout
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        this.refreshToken().subscribe({
          error: () => this.logout(),
        });
      } else {
        this.logout();
      }
    }
  }
}
