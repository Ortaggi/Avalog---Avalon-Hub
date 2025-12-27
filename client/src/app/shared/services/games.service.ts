import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';

@Injectable()
export class GameService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService();

  getGames(): Promise<any> {
    return this.service.getAll('games');
  }
}
