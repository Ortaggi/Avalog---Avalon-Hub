import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';
import { ApiInterface } from '../../core/api/api.interface';
import { Statistics } from '../models/statistics';

@Injectable()
export class StatisticsService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService() as ApiInterface;

  getStatistics(userId: string): Promise<Statistics> {
    return this.service.getById<Statistics>('stats', userId);
  }
}
