import { Injectable, inject } from '@angular/core';
import { HttpErrorReporterService } from './http-error-reporter.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private httpErrorReporterService = inject(HttpErrorReporterService);
  private notificationService = inject(NotificationService);

  constructor() {
    this.httpErrorReporterService.error$.subscribe(error => {
      let errorMessage = 'An HTTP error occurred';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.status) {
        errorMessage = this.getStatusMessage(error.status);
      }

      this.notificationService.error(errorMessage, 'Dismiss');
    });
  }

  private getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request - The request was invalid';
      case 401:
        return 'Unauthorized - Please log in';
      case 403:
        return "Forbidden - You don't have permission";
      case 404:
        return 'Not Found - The requested resource was not found';
      case 500:
        return 'Internal Server Error - Please try again later';
      case 502:
        return 'Bad Gateway - Server is temporarily unavailable';
      case 503:
        return 'Service Unavailable - Please try again later';
      default:
        return `HTTP Error ${status}`;
    }
  }
}
