import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aspetta che la sessione sia ripristinata
  if (!authService.isAuthenticated()) {
    await authService.restoreSession();
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  await router.navigate(['/dashboard']);
  return false;
};
