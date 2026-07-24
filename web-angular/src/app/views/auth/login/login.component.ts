import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../common/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Password'} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
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
