import { createProdConfig } from './envs/prod';
import { createLocalConfig } from './envs/local'

export const appConfig = getConfig();

function getConfig() {
  switch (import.meta.env.NG_APP_ENV) {
    case 'production':
      console.log('Load prod configuration');
      return createProdConfig();
    case 'local':
      console.log('Load local configuration');
      return createLocalConfig();
    default:
      throw new Error(`Invalid APP_ENV "${import.meta.env.NG_APP_ENV}"`);
  }
}
