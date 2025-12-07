import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    // Simulo una chiamata
    setTimeout(() => {
      const success = this.authService.login(this.email);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Credenziali non valide';
      }

      this.isLoading = false;
    }, 1000);
  }
}
