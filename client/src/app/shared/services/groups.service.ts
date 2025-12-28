import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';

@Injectable()
export class GroupService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService();

  getByUserId(userId: string) {
    return this.service.getById<any>('groups/user', userId);
  }
}
