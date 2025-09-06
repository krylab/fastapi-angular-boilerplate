import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../api-generated/Auth';
import { RegisterInput } from '../../../api-generated/data-contracts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  userCreateSignal = signal<RegisterInput | undefined>(undefined);
  registrationSuccess = false;

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerResource = this.authService.register(this.userCreateSignal, environment.apiUrl);

  constructor() {
    effect(() => {
      const value = this.registerResource.value();
      const status = this.registerResource.status();

      if (status === 'resolved' && value) {
        this.registrationSuccess = true;
        this.router.navigate(['/auth/login']);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeToPolicy: [false, [Validators.requiredTrue]],
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  getFieldError(fieldName: string): string | null {
    const field = this.registerForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors?.['requiredTrue']) {
        return 'You must agree to the Privacy Policy';
      }
    }

    if (
      fieldName === 'confirmPassword' &&
      this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmPassword')?.dirty
    ) {
      return 'Passwords do not match';
    }

    return null;
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
    };
    return displayNames[fieldName] || fieldName;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const userData: RegisterInput = {
        email: formValue.email,
        password: formValue.password,
        is_active: true,
        is_superuser: false,
        is_verified: false,
      };
      this.userCreateSignal.set(userData);
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
