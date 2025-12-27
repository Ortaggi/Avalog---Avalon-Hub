import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  username = '';
  displayName = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  async onSubmit(): Promise<void> {
    console.log(
      'Register submitted:',
      this.email,
      this.username,
      this.displayName,
      this.password,
      this.confirmPassword,
    );
  }
}
