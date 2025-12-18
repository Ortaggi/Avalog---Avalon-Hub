import { FastifyTypedInstance } from '../types/fastify.js';
import { authenticate } from '../plugins/authenticate.js';
import { schemaStats } from '../schemas/stats.js';
import {
  getLeaderboard,
  getUserStats,
} from '../controllers/statsController.js';

export async function statsRoutes(app: FastifyTypedInstance) {
  app.get(
    '/:userId',
    {
      preHandler: [authenticate],
      schema: schemaStats.getByUserId,
    },
    async (request) => getUserStats(request.params.userId),
  );

  app.get(
    '/leaderboard',
    {
      preHandler: [authenticate],
      schema: schemaStats.leaderboard,
    },
    async (request) => getLeaderboard(request.query),
  );
}
