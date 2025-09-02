import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../common/services/notification.service';
import { RestService } from '../../common/services/rest.service';

@Component({
  selector: 'app-error-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h2 class="text-2xl font-bold text-gray-900">Error Handling Demo</h2>

      <div class="space-y-3">
        <button (click)="testNotification()" class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Test Direct Notification
        </button>

        <button (click)="triggerSyncError()" class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Trigger Synchronous Error
        </button>

        <button
          (click)="triggerHttpError()"
          class="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Trigger HTTP Error (404)
        </button>

        <button
          (click)="triggerHttpErrorSkipped()"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Trigger HTTP Error (Skipped)
        </button>

        <button
          (click)="triggerServerError()"
          class="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Trigger Server Error (500)
        </button>
      </div>

      <div class="text-sm text-gray-600">
        <p>Click the buttons above to test different error scenarios:</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Direct notification test</li>
          <li>Synchronous errors are handled by AppErrorHandler</li>
          <li>HTTP errors are handled by the interceptor</li>
          <li>Skipped errors won't show notifications</li>
          <li>All errors appear in the notification container</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
})
export class ErrorDemoComponent {
  private restService = inject(RestService);
  private notificationService = inject(NotificationService);

  testNotification(): void {
    // Test direct notification without any HTTP/error context
    this.notificationService.success('✅ Success notification test!', 'Close');
    setTimeout(() => {
      this.notificationService.error(
        '🔴 Error notification test with a very long message to see how it wraps and displays properly in different layouts!',
        'Dismiss'
      );
    }, 1000);
    setTimeout(() => {
      this.notificationService.warning('⚠️ Warning notification test!', 'OK');
    }, 2000);
    setTimeout(() => {
      this.notificationService.info('ℹ️ Info notification test!', 'Got it');
    }, 3000);
  }

  triggerSyncError(): void {
    // This will trigger the global error handler
    throw new Error('This is a test synchronous error!');
  }

  triggerHttpError(): void {
    // This will trigger the HTTP error interceptor
    this.restService.get('https://jsonplaceholder.typicode.com/nonexistent-endpoint').subscribe({
      next: data => console.log(data),
      error: error => console.log('Error caught in component:', error),
    });
  }

  triggerHttpErrorSkipped(): void {
    // This will trigger an HTTP error but skip the global error handling
    this.restService
      .get('https://jsonplaceholder.typicode.com/nonexistent-endpoint', {
        skipErrorHandling: true,
      })
      .subscribe({
        next: data => console.log(data),
        error: error => console.log('Skipped error (no notification):', error),
      });
  }

  triggerServerError(): void {
    // This simulates a server error
    this.restService.get('https://httpstat.us/500').subscribe({
      next: data => console.log(data),
      error: error => console.log('Server error caught:', error),
    });
  }
}
