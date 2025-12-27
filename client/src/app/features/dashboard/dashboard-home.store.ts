import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { StatisticsService } from '../../shared/services/statistics.service';
import { currentUserStore } from '../../shared/current-user.store';
import { GameService } from '../../shared/services/games.service';
import { Statistics } from '../../shared/models/statistics';

interface DashboardHomeState {
  isLoading: boolean;
  error: string | null;
  statistics: Statistics | null;
  matches: any[];
}

export const initialDashboardHomeState: DashboardHomeState = {
  isLoading: false,
  error: null,
  statistics: null,
  matches: [],
};

export const dashboardHomeStore = signalStore(
  withState(initialDashboardHomeState),
  withComputed(({ statistics }) => ({
    lostGames: computed(() => {
      const total = statistics()?.totalGames ?? 0;
      const wins = statistics()?.wins ?? 0;
      return total - wins;
    }),
    winRate: computed(() => {
      const total = statistics()?.totalGames ?? 0;
      const wins = statistics()?.wins ?? 0;
      return total > 0 ? (wins / total) * 100 : 0;
    }),
  })),
  withMethods(
    (
      store,
      statService = inject(StatisticsService),
      loggedService = inject(currentUserStore),
      gameService = inject(GameService),
    ) => ({
      async loadData() {
        const userId = loggedService.id();
        if (!userId) {
          return;
        }

        patchState(store, { isLoading: true });
        try {
          const [statistics, matches] = await Promise.all([
            statService.getStatistics(userId),
            gameService.getGames(),
          ]);
          console.log('Statistics: ', statistics, ' game: ', matches);
          patchState(store, { statistics, matches });
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    }),
  ),
  withHooks({
    onInit: (store) => {
      // Call loadData when the store is initialized
      store.loadData();
    },
  }),
);
