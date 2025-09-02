import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorReporterService } from '../services/http-error-reporter.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const httpErrorReporter = inject(HttpErrorReporterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const skipErrorHandling = req.headers.get('Skip-Error-Handling') === 'true';

      // Check if this is a network error (can't reach server) or HTTP error (server responded with error status)
      if (error.status === 0 || !error.status) {
        // Network error: request couldn't reach the server
        if (!skipErrorHandling) {
          // Handle network errors differently - create custom error with user-friendly message
          const networkError = {
            ...error,
            message: 'Cannot connect to server. Please check your internet connection.',
            originalMessage: error.message,
          } as HttpErrorResponse;
          httpErrorReporter.reportError(networkError);
        }
      } else {
        // HTTP Error: server responded but with error status (400, 401, 404, 500, etc.)
        if (!skipErrorHandling) {
          // Handle HTTP errors normally - server provided error details
          httpErrorReporter.reportError(error);
        }
      }

      return throwError(() => error);
    })
  );
};
