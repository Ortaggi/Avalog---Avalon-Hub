import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';
import { Game, GameDetail } from '../models';
import { MatchListFilters } from '../../features/matches/pages/matches-list/match-list.store';

@Injectable()
export class GameService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService();

  getGames(filters: MatchListFilters | null = null) {
    return this.service.getAll<Game>('games', filters);
  }

  getGamesByUserId(userId: string) {
    return this.service.getById<Game[]>('games/user', userId);
  }

  getGameDetail(gameId: string) {
    return this.service.getById<GameDetail>('games', gameId);
  }

  createGame(game: GameDetail) {
    return this.service.create<GameDetail>('games', game);
  }

  updateGame(game: GameDetail) {
    return this.service.update<GameDetail>('games', game.id!, game);
  }
}
