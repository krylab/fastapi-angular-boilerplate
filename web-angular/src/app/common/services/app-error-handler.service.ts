import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AppErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);

  handleError(error: any): void {
    let errorMessage = 'An unexpected error occurred';
    let debugInfo = '';

    // Check if this is an HTTP error response with trace_id
    if (error?.error?.extra?.trace_id) {
      debugInfo = ` (Trace ID: ${error.error.extra.trace_id})`;
    }

    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }

    // Generate a client-side error ID for tracking if no trace_id is available
    if (!debugInfo) {
      const clientErrorId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      debugInfo = ` (Error ID: ${clientErrorId})`;

      // Log error details for debugging
      console.error('Client-side error:', {
        errorId: clientErrorId,
        error: error,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }

    this.notificationService.error(`${errorMessage}${debugInfo}`, 'Dismiss');
  }
}
