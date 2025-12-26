import { InjectionToken } from '@angular/core';

export type ServerType = 'api' | 'supabase';

export const SERVER_TYPE_TOKEN = new InjectionToken<ServerType>('SERVER_TYPE_TOKEN');
