import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Game, GameResultList, VictoryTypeList } from '../../../../shared/models';
import { inject } from '@angular/core';
import { GameService } from '../../../../shared/services/games.service';

export interface MatchListFilters {
  startDate?: Date | null;
  endDate?: Date | null;
  result?: string;
  winType?: string;
}

type GameWithResultAndWinType = Omit<Game, 'result' | 'winType'> & {
  result?: string;
  winType?: string;
};

interface MatchListState {
  isLoading: boolean;
  games: GameWithResultAndWinType[];
  filters: MatchListFilters | null;
}

export const initialMatchListState: MatchListState = {
  isLoading: false,
  games: [],
  filters: null,
};

export const MatchListStore = signalStore(
  withState(initialMatchListState),
  withMethods((store, gameService = inject(GameService)) => ({
    async loadData(filters: MatchListFilters | null) {
      // Remove null values from filters
      if (filters) {
        filters = Object.fromEntries(
          Object.values(filters || {}).filter((value) => value !== null && value !== ''),
        );
        patchState(store, (state) => ({
          isLoading: true,
          filters: { ...state.filters, ...filters },
        }));
      }
      const res = await gameService.getGames(filters);
      const mappedGames = res.map((game: Game) => ({
        ...game,
        result: GameResultList.find((r) => r.value === game.result)?.label,
        winType: VictoryTypeList.find((r) => r.value === game.winType)?.label,
      }));
      patchState(store, { games: mappedGames, isLoading: false });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadData(null);
    },
  }),
);
