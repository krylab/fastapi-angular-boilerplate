import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NotificationData, NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notification-container',
  imports: [NotificationComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './notification-container.component.html',
})
export class NotificationContainerComponent {
  private notificationService = inject(NotificationService);

  get notifications(): NotificationData[] {
    return this.notificationService.notifications;
  }

  onNotificationClose(id: string): void {
    this.notificationService.remove(id);
  }

  onNotificationActionClick(id: string): void {
    this.notificationService.remove(id);
  }

  trackByNotificationId(index: number, notification: NotificationData): string {
    return notification.id;
  }
}
