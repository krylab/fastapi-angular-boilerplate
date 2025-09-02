import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'http-error' | 'warning' | 'info';
  action?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationData[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  get notifications(): NotificationData[] {
    return this.notificationsSubject.value;
  }

  // Method to display a notification
  public notify(message: string, action: string = 'OK', config?: Partial<NotificationData>): void {
    const notification: NotificationData = {
      id: this.generateId(),
      message,
      action,
      type: 'info',
      duration: 8000, // 8 seconds default (increased from 5)
      ...config,
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  // Convenience methods for different notification types
  public success(message: string, action?: string, config?: Partial<NotificationData>): void {
    this.notify(message, action, { ...config, type: 'success', duration: 6000 }); // 6 seconds for success
  }

  public error(message: string, action?: string, config?: Partial<NotificationData>): void {
    this.notify(message, action, { ...config, type: 'error', duration: 0 }); // Error notifications persist until closed
  }

  public httpError(message: string, action?: string, config?: Partial<NotificationData>): void {
    this.notify(message, action, { ...config, type: 'http-error', duration: 0 }); // HTTP error notifications persist until closed
  }

  public warning(message: string, action?: string, config?: Partial<NotificationData>): void {
    this.notify(message, action, { ...config, type: 'warning', duration: 10000 }); // 10 seconds for warnings
  }

  public info(message: string, action?: string, config?: Partial<NotificationData>): void {
    this.notify(message, action, { ...config, type: 'info' });
  }

  // Remove a notification by ID
  public remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  // Clear all notifications
  public clear(): void {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
