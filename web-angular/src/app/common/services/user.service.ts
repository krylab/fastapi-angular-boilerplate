import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from './auth.service';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  fullname: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  name?: string;
  fullname?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUserProfile$ = this.currentUserProfileSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Subscribe to auth changes and update user profile accordingly
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadUserProfile();
      } else {
        this.currentUserProfileSubject.next(null);
      }
    });
  }

  /**
   * Get current user profile from JWT token
   */
  getCurrentUserFromToken(): JwtPayload | null {
    return this.authService.getCurrentUser();
  }

  /**
   * Load full user profile from API
   */
  loadUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/me`).pipe(
      tap(profile => {
        this.currentUserProfileSubject.next(profile);
      })
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(updateData: UpdateUserRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${environment.apiUrl}/users/me`, updateData).pipe(
      tap(updatedProfile => {
        this.currentUserProfileSubject.next(updatedProfile);
      })
    );
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const passwordData = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    return this.http.post(`${environment.apiUrl}/users/change-password`, passwordData);
  }

  /**
   * Get user roles from current session
   */
  getUserRoles(): string[] {
    return this.authService.getRoles();
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  /**
   * Get current user email
   */
  getCurrentUserEmail(): string | null {
    const user = this.getCurrentUserFromToken();
    return user?.email || null;
  }

  /**
   * Get current user full name
   */
  getCurrentUserFullName(): string | null {
    const user = this.getCurrentUserFromToken();
    return user?.fullname || user?.name || null;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    const user = this.getCurrentUserFromToken();
    return user?.nameid || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
    this.currentUserProfileSubject.next(null);
  }

  /**
   * Get current user profile (cached)
   */
  getCurrentUserProfile(): UserProfile | null {
    return this.currentUserProfileSubject.value;
  }
}
