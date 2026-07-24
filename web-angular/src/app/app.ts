import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './common/components/notification-container/notification-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <router-outlet />
    <app-notification-container />
  `,
})
export class App {
  protected readonly title = signal('web-angular');
}
