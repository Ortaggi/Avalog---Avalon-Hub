import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { currentUserStore } from '../shared/current-user.store';

export const authGuard: CanActivateFn = async () => {
  const store = inject(currentUserStore);
  const isAuthenticated = await store.fetchCurrentUser();
  return isAuthenticated;
};
