import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';

@Injectable()
export class UsersService {
  apiFactory = inject(ApiFactoryService);
  service = this.apiFactory.getApiService();

  getAll() {
    return this.service.getAll<any>('users');
  }
}
