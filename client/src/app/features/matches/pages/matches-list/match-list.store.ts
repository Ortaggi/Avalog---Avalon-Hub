import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Game, Group } from '../../../../shared/models';
import { inject } from '@angular/core';
import { GameService } from '../../../../shared/services/games.service';
import { GroupService } from '../../../../shared/services/groups.service';
import { currentUserStore } from '../../../../shared/current-user.store';

interface MatchListState {
  isLoading: boolean;
  games: Game[];
  groups: Group[];
}

export const initialMatchListState: MatchListState = {
  isLoading: false,
  games: [],
  groups: [],
};

export const MatchListStore = signalStore(
  withState(initialMatchListState),
  withMethods(
    (
      store,
      gameService = inject(GameService),
      groupService = inject(GroupService),
      auth = inject(currentUserStore),
    ) => ({
      async loadData() {
        patchState(store, { isLoading: true });
        try {
          const [games, groups] = await Promise.all([
            gameService.getByUserId(auth.id()!),
            groupService.getByUserId(auth.id()!),
          ]);
          patchState(store, { games, groups });
        } catch (error) {
          console.error(error);
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadData();
    },
  }),
);
