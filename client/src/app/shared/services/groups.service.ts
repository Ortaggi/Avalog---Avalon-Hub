import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';

@Injectable()
export class GroupService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService();

  getAll() {
    return this.service.getAll<any>('groups');
  }

  getByUserId(userId: string) {
    return this.service.getById<any>('groups/user', userId);
  }

  getById(groupId: string) {
    return this.service.getById<any>('groups', groupId);
  }
}
