import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { currentUserStore } from '../shared/current-user.store';

export const authGuard: CanActivateFn = async () => {
  const store = inject(currentUserStore);
  const router = inject(Router);
  const isAuthenticated = await store.fetchCurrentUser();

  if (!isAuthenticated) {
    return router.createUrlTree(['/auth/login']);
  }
  return true;
};
