import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationService } from './notification.service';

// Backend error structure
interface BackendError {
  status: number;
  type: string;
  message: string;
  debug: string;
  extra: {
    trace_id: string;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HttpErrorReporterService {
  private _error$ = new Subject<HttpErrorResponse>();
  private notificationService = inject(NotificationService);

  get error$() {
    return this._error$.asObservable();
  }

  reportError(error: HttpErrorResponse) {
    // Extract structured error details from backend
    const backendError = this.extractBackendError(error);

    // Extract trace_id from response headers if available
    const traceId = this.extractTraceIdFromHeaders(error);

    // Show user-friendly notification
    this.showErrorNotification(backendError, error, traceId);

    // Emit error for other subscribers
    this._error$.next(error);
  }

  private extractBackendError(error: HttpErrorResponse): BackendError | null {
    try {
      // Check if error.error contains our structured backend error
      if (error.error && typeof error.error === 'object') {
        const errorBody = error.error as any;

        // Validate it has our expected structure
        if (errorBody.status && errorBody.type && errorBody.message) {
          return errorBody as BackendError;
        }
      }
    } catch (e) {
      // Silently fail parsing - fallback to generic error handling
    }

    return null;
  }

  private extractTraceIdFromHeaders(error: HttpErrorResponse): string | null {
    try {
      // Try to get trace_id from response headers
      return error.headers.get('x-trace-id') || null;
    } catch (e) {
      return null;
    }
  }

  private showErrorNotification(backendError: BackendError | null, httpError: HttpErrorResponse, traceId: string | null) {
    let userMessage: string;
    let debugInfo: string = '';

    if (backendError) {
      // Use structured backend error
      userMessage = backendError.message;
      debugInfo = `Trace ID: ${backendError.extra.trace_id}`;

      // Show user-friendly notification with trace ID for reference
      this.notificationService.error(`${userMessage}${debugInfo ? ` (${debugInfo})` : ''}`, 'Dismiss', {
        duration: 0, // Don't auto-dismiss error notifications
      });
    } else {
      // Fallback to generic error handling with formatted HTTP error details
      let httpDetails = '';
      if (httpError.url) {
        const urlParts = httpError.url.split('/');
        const endpoint = urlParts.slice(-2).join('/'); // Get last 2 parts of URL (e.g., "auth/register")
        httpDetails = `\nEndpoint: ${endpoint} | Status: ${httpError.status} ${httpError.statusText}`;
      }

      // Add trace ID from headers if available
      if (traceId) {
        httpDetails += `\nTrace ID: ${traceId}`;
      }

      switch (httpError.status) {
        case 400:
          userMessage = 'Invalid request. Please check your input and try again.';
          break;
        case 401:
          userMessage = 'You are not authorized. Please log in and try again.';
          break;
        case 403:
          userMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          userMessage = 'The requested resource was not found.';
          break;
        case 422:
          userMessage = 'The data you provided is invalid. Please check and try again.';
          break;
        case 500:
          userMessage = 'A server error occurred. Please try again later.';
          break;
        default:
          userMessage = `An error occurred (${httpError.status}). Please try again.`;
      }

      // Use the new httpError method for HTTP-specific errors with better formatting
      this.notificationService.httpError(`${userMessage}${httpDetails}`, 'Dismiss', { duration: 0 });
    }
  }
}
