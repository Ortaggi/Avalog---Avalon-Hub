import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { GroupService } from '../../../../shared/services/groups.service';
import { UsersService } from '../../../../shared/services/users.service';
import { GameService } from '../../../../shared/services/games.service';
import { GameDetail, GameFactionType, GameRolesType } from '../../../../shared/models';

interface MatchDetailState {
  isLoading: boolean;
  error: any;
  availableUsers: any[];
  availableGroups: any[];
  game: Partial<GameDetail>;
}

const initialState: MatchDetailState = {
  isLoading: false,
  error: null,
  availableUsers: [],
  availableGroups: [],
  game: {
    groupId: '',
    result: 'GOOD_WIN',
    winType: 'THREE_MISSIONS',
    notes: '',
    participants: [
      {
        userId: '',
        role: 'GOOD_SIMPLE',
        faction: 'GOOD',
        nickname: '',
      },
    ],
  },
};

export const MatchDetailStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      usersService = inject(UsersService),
      groupsService = inject(GroupService),
      gameService = inject(GameService),
    ) => ({
      async loadData() {
        patchState(store, { isLoading: true });
        try {
          const [users, groups] = await Promise.all([
            usersService.getAll(),
            groupsService.getAll(),
          ]);
          patchState(store, { isLoading: false, availableUsers: users, availableGroups: groups });
        } catch (error) {
          patchState(store, { isLoading: false, error });
        }
      },
      setGame(game: MatchDetailState['game']) {
        patchState(store, { game });
      },
      updateGame(game: Partial<MatchDetailState['game']>) {
        patchState(store, (state) => ({ game: { ...state.game, ...game } }));
      },
      addParticipant() {
        patchState(store, (state) => ({
          game: {
            ...state.game,
            participants: [
              ...(state.game.participants || []),
              {
                userId: '',
                role: 'GOOD_SIMPLE' as GameRolesType,
                faction: 'GOOD' as GameFactionType,
                nickname: '',
              },
            ],
          },
        }));
      },
      removeParticipant(index: number) {
        patchState(store, (state) => ({
          game: {
            ...state.game,
            participants: state.game.participants?.filter((_, i) => i !== index),
          },
        }));
      },
      updateParticipant(index: number, participant: Partial<GameDetail['participants'][0]>) {
        patchState(store, (state) => {
          const participants = [...(state.game.participants || [])];
          participants[index] = { ...participants[index], ...participant };
          if (participant.faction && participant.faction !== participants[index].faction) {
            // Reset role if faction changes
            participants[index].role = (
              participant.faction === 'GOOD' ? 'GOOD_SIMPLE' : 'EVIL_SIMPLE'
            ) as GameRolesType;
          }
          return {
            game: {
              ...state.game,
              participants,
            },
          };
        });
      },
      async getGameDetail(id: string) {
        patchState(store, { isLoading: true });
        try {
          const game = await gameService.getGameDetail(id);
          patchState(store, { game, isLoading: false });
        } catch (error) {
          patchState(store, { isLoading: false, error });
        }
      },
      async saveGame() {
        patchState(store, { isLoading: true });
        try {
          if (store.game().id) {
            const game = await gameService.updateGame(store.game() as GameDetail);
            patchState(store, { game, isLoading: false });
          } else {
            const game = await gameService.createGame(store.game() as GameDetail);
            patchState(store, { game, isLoading: false });
          }
        } catch (error) {
          patchState(store, { isLoading: false, error });
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
