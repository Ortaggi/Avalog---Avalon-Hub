import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface CurrentUserState {
  id: string | null;
  email: string | null;
}

const initialState: CurrentUserState = {
  id: null,
  email: null,
};

export const currentUserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setCurrentUser(user: Partial<CurrentUserState>) {
      patchState(store, { ...user });
    },
    async fetchCurrentUser(): Promise<boolean> {
      if (store.id()) {
        return true;
      }

      try {
        const fetchedUser: CurrentUserState = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: '123',
              email: 'user@example.com',
            });
          }, 1000);
        });

        patchState(store, fetchedUser);
        return true;
      } catch (error) {
        console.error('Error fetching current user:', error);
        return false;
      }
    },
  })),
);
