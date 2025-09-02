import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationData, NotificationService } from '../../common/services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
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
    // Handle action click if needed
    this.notificationService.remove(id);
  }

  trackByNotificationId(index: number, notification: NotificationData): string {
    return notification.id;
  }
}
