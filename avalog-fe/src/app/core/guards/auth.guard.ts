import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Aspetto che la sessione sia ripristinata
  if (!authService.isAuthenticated()) {
    await authService.restoreSession();
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  await router.navigate(['/auth/login']);
  return false;
};
