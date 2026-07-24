import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../common/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';

interface LoginModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  protected readonly loginModel = signal<LoginModel>({
    email: '',
    password: '',
    rememberMe: false,
  });

  protected readonly loginForm = form(this.loginModel, f => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Please enter a valid email address' });
    required(f.password, { message: 'Password is required' });
  });

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email: emailValue, password } = this.loginModel();

    this.authService.login(emailValue, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        const status = (error as { status?: number })?.status;
        const message =
          status === 400 || status === 401 ? 'Invalid email or password' : 'Login failed. Please try again.';
        this.errorMessage.set(message);
        this.notificationService.error(message);
      },
    });
  }
}
