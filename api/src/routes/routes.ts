import { FastifyTypedInstance } from '../types/fastify.js';
import { usersRoutes } from './users.js';
import { authRoutes } from './auth.js';
import { groupsRoutes } from './groups.js';
import { gamesRoutes } from './games.js';
import { statsRoutes } from './stats.js';

export async function routes(app: FastifyTypedInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/users' });
  app.register(groupsRoutes, { prefix: '/groups' });
  app.register(gamesRoutes, { prefix: '/games' });
  app.register(statsRoutes, { prefix: '/stats' });
}
