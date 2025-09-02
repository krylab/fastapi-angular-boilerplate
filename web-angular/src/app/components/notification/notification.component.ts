import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NotificationData } from '../../common/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: NotificationData;
  @Output() close = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<string>();

  private timeoutId?: number;

  ngOnInit(): void {
    // Only set auto-dismiss timer if duration is specified and greater than 0
    if (this.notification.duration && this.notification.duration > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.onClose();
      }, this.notification.duration);
    }
  }

  ngOnDestroy(): void {
    // Clear timeout if component is destroyed before timeout completes
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onClose(): void {
    this.close.emit(this.notification.id);
  }

  onActionClick(): void {
    this.actionClick.emit(this.notification.id);
  }

  getNotificationClasses(): string {
    const baseClasses = 'p-4 rounded-lg shadow-2xl border-l-4 mb-2 transition-all duration-300 ease-in-out backdrop-blur-sm';

    switch (this.notification.type) {
      case 'success':
        return `${baseClasses} bg-green-100 border-green-500 text-green-900 shadow-green-200/50`;
      case 'error':
        return `${baseClasses} bg-red-100 border-red-500 text-red-900 shadow-red-200/50`;
      case 'http-error':
        return `${baseClasses} bg-orange-100 border-orange-600 text-orange-900 shadow-orange-200/50`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 border-yellow-500 text-yellow-900 shadow-yellow-200/50`;
      case 'info':
        return `${baseClasses} bg-blue-100 border-blue-500 text-blue-900 shadow-blue-200/50`;
      default:
        return `${baseClasses} bg-gray-100 border-gray-500 text-gray-900 shadow-gray-200/50`;
    }
  }

  getIconClasses(): string {
    switch (this.notification.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'http-error':
        return 'text-orange-500';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }
}
