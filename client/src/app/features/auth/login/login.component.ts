import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { currentUserStore } from '../../../shared/current-user.store';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  private readonly router: Router = inject(Router);
  private readonly authStore = inject(currentUserStore);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onSubmit(): Promise<void> {
    console.log('Login submitted:', this.email, this.password);
    this.authStore
      .login(this.email, this.password)
      .then((result) => {
        if (result?.token) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred during login. Please try again.';
      });
  }
}
