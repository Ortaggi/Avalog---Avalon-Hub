import { inject, Injectable } from '@angular/core';
import { ApiFactoryService } from '../../core/api/api.service';
import { ApiInterface } from '../../core/api/api.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiFactory = inject(ApiFactoryService);
  service: ApiInterface = this.apiFactory.getApiService();

  login(email: string, password: string): Promise<unknown> {
    return this.service.signIn(email, password);
  }

  register(email: string, password: string, userData?: any): Promise<void> {
    return this.service.signUp(email, password, userData);
  }

  me(): Promise<any> {
    return this.service.getCurrentUser();
  }

  logout() {
    return this.service.signOut();
  }
}
