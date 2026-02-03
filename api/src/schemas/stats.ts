import { z } from 'zod';
import { Role, UserStatsResponse } from '../dtos/stats.js';

export const schemaStats = {
  getByUserId: {
    tags: ['Stats'],
    description: 'Get statistics for a specific user',
    security: [{ BearerAuth: [] }],
    params: z.object({ userId: z.uuid() }),
    response: {
      200: UserStatsResponse,
    },
  },
  leaderboard: {
    tags: ['Stats'],
    description: 'Get global leaderboard, sorted by win rate',
    security: [{ BearerAuth: [] }],
    querystring: z.object({
      minGames: z.number().optional(),
      faction: z.enum(['GOOD', 'EVIL']).optional(),
      role: Role.optional(),
    }),
    response: {
      200: z.array(
        z.object({
          userId: z.uuid(),
          nickname: z.string().nullable(),
          winRate: z.number(),
          totalGames: z.number(),
        }),
      ),
    },
  },
};
