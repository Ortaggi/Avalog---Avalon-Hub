import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    nickname: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', [Validators.required, this.passwordMatchValidator()]],
  });

  passwordMatchValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;
    await this.authService.register(
      this.registerForm.value.email,
      this.registerForm.value.password,
      { nickname: this.registerForm.value.nickname },
    );
    this.router.navigate(['/auth/login']);
  }
}
