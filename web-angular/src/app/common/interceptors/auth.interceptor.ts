import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = localStorage.getItem('accessToken');
  let authReq = req;

  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (
        err.status === 401 &&
        !authReq.url.endsWith('/login') &&
        !authReq.url.endsWith('/register') &&
        !authReq.url.endsWith('/refresh-token')
      ) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newAuthToken = authService.getAccessToken();
            const newAuthReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newAuthToken}`),
            });
            return next(newAuthReq);
          }),
          catchError(error => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
