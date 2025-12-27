import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';
import { ApiInterface } from '../../core/api/api.interface';

@Injectable()
export class StatisticsService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService() as ApiInterface;

  getStatistics(userId: string): Promise<any> {
    return this.service.getById('stats', userId);
  }
}
