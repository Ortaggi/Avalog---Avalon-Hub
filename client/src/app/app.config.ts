import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SERVER_TYPE_TOKEN, ServerType } from './core/config/client.config';

const serverType: ServerType = (import.meta.env.NG_APP_SERVER_TYPE as ServerType) || 'api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: SERVER_TYPE_TOKEN, useValue: serverType }
  ]
};
