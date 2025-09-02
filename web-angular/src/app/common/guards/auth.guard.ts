import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifySrv = inject(NotificationService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    notifySrv.notify('Please login again', 'Expire', {
      duration: 3000,
    });
    router.navigate(['/auth/login']);
    return false;
  }
};
