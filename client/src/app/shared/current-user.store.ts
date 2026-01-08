import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthService } from '../features/auth/auth.service';

interface CurrentUserState {
  id: string | null;
  email: string | null;
  nickname?: string | null;
  avatarUrl?: string | null;
}

const initialState: CurrentUserState = {
  id: null,
  email: null,
  nickname: null,
  avatarUrl: null,
};

export const currentUserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    async login(email: string, password: string): Promise<{ token: string } | null> {
      try {
        const response = (await authService.login(email, password)) as { token: string };
        localStorage.setItem('avalog_st', response?.token);
        const fetchedUser: CurrentUserState = await authService.me();
        patchState(store, fetchedUser);
        return response;
      } catch (error) {
        console.error('Error logging in:', error);
        return null;
      }
    },
    async logout(options?: { skipApi?: boolean }) {
      try {
        if (!options?.skipApi) {
          await authService.logout();
        }
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        localStorage.removeItem('avalog_st');
        patchState(store, initialState);
        globalThis.location.href = '/auth/login';
      }
    },
    async fetchCurrentUser(): Promise<boolean> {
      if (store.id()) {
        return true;
      }

      if (!localStorage.getItem('avalog_st')) {
        return false;
      }

      try {
        const fetchedUser: CurrentUserState = await authService.me();
        patchState(store, fetchedUser);
        return true;
      } catch (error) {
        console.error('Error fetching current user:', error);
        return false;
      }
    },
  })),
);
