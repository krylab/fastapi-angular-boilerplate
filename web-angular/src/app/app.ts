import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './common/components/notification-container/notification-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  template: `
    <router-outlet />
    <app-notification-container />
  `,
})
export class App {
  protected readonly title = signal('web-angular');
}
