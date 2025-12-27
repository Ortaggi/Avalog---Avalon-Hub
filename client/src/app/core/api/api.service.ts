import { inject, Injectable } from '@angular/core';
import { ApiInterface } from './api.interface';
import { SupabaseApi } from './supabase';
import { BackendApi } from './backend';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiFactoryService {
  private apiInstance: ApiInterface | null = null;

  getApiService(): ApiInterface {
    this.apiInstance ??= environment.useSupabase
      ? new SupabaseApi()
      : new BackendApi(inject(HttpClient));
    return this.apiInstance;
  }
}
