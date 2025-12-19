import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  email = '';
  username = '';
  displayName = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }

    this.isLoading = true;

    try {
      const success = await this.authService.register(
        this.email,
        this.username,
        this.displayName,
        this.password
      );

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Email o username già in uso';
      }
    } catch {
      this.errorMessage = 'Errore durante la registrazione';
    } finally {
      this.isLoading = false;
    }
  }
}
