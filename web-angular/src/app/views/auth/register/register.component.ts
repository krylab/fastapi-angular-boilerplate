import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../api-generated/Auth';
import { RegisterInput } from '../../../api-generated/data-contracts';

interface RegisterModel {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToPolicy: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
})
export class RegisterComponent {
  private authService = inject(Auth);
  private router = inject(Router);

  readonly registrationSuccess = signal(false);
  readonly registrationError = signal<string | null>(null);

  protected readonly registerModel = signal<RegisterModel>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToPolicy: false,
  });

  protected readonly registerForm = form(this.registerModel, f => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Please enter a valid email address' });
    required(f.password, { message: 'Password is required' });
    minLength(f.password, 8, { message: 'Password must be at least 8 characters' });
    required(f.confirmPassword, { message: 'Confirm Password is required' });
    validate(f.confirmPassword, ctx =>
      ctx.value() !== ctx.valueOf(f.password) ? { kind: 'passwordMismatch', message: 'Passwords do not match' } : null
    );
    required(f.agreeToPolicy, { message: 'You must agree to the Privacy Policy' });
  });

  private readonly userCreateSignal = signal<RegisterInput | undefined>(undefined);
  private readonly registerResource = this.authService.register(this.userCreateSignal, environment.apiUrl);

  constructor() {
    effect(() => {
      const status = this.registerResource.status();
      if (status === 'resolved' && this.registerResource.value()) {
        this.registrationSuccess.set(true);
        this.router.navigate(['/auth/login']);
      } else if (status === 'error') {
        this.registrationError.set('Registration failed. This email may already be registered.');
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.registrationError.set(null);

    if (this.registerForm().invalid()) {
      this.registerForm().markAsTouched();
      return;
    }

    const model = this.registerModel();
    this.userCreateSignal.set({
      email: model.email,
      password: model.password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
    });
  }
}
