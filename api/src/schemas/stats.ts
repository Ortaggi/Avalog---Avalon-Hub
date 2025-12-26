import { z } from 'zod';

export const schemaStats = {
  getByUserId: {
    tags: ['Stats'],
    description: 'Get statistics for a specific user',
    security: [{ BearerAuth: [] }],
    params: z.object({ userId: z.string().uuid() }),
    response: {
      200: z.object({
        totalGames: z.number(),
        wins: z.number(),
        goodWins: z.number(),
        evilWins: z.number(),
        mostPlayedRole: z
          .enum([
            'MERLIN',
            'PERCIVAL',
            'GOOD_SIMPLE',
            'ASSASSIN',
            'MORGANA',
            'MORDRED',
            'OBERON',
            'EVIL_SIMPLE',
          ])
          .nullable(),
        bestRole: z
          .enum([
            'MERLIN',
            'PERCIVAL',
            'GOOD_SIMPLE',
            'ASSASSIN',
            'MORGANA',
            'MORDRED',
            'OBERON',
            'EVIL_SIMPLE',
          ])
          .nullable(),
      }),
    },
  },
  leaderboard: {
    tags: ['Stats'],
    description: 'Get global leaderboard, sorted by win rate',
    security: [{ BearerAuth: [] }],
    querystring: z.object({
      minGames: z.number().optional(),
      faction: z.enum(['GOOD', 'EVIL']).optional(),
      role: z
        .enum([
          'MERLIN',
          'PERCIVAL',
          'GOOD_SIMPLE',
          'ASSASSIN',
          'MORGANA',
          'MORDRED',
          'OBERON',
          'EVIL_SIMPLE',
        ])
        .optional(),
    }),
    response: {
      200: z.array(
        z.object({
          userId: z.string().uuid(),
          nickname: z.string().nullable(),
          winRate: z.number(),
          totalGames: z.number(),
        }),
      ),
    },
  },
};
