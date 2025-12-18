import { z } from 'zod';

export const schemaGames = {
  getAll: {
    tags: ['Games'],
    description: 'List all games',
    security: [{ BearerAuth: [] }],
    response: {
      200: z.array(
        z.object({
          id: z.string().uuid(),
          groupId: z.string().uuid(),
          result: z.enum(['GOOD_WIN', 'EVIL_WIN']),
          winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).nullable(),
          playedAt: z.string(),
        }),
      ),
    },
  },
  create: {
    tags: ['Games'],
    description: 'Create a new game with participants',
    security: [{ BearerAuth: [] }],
    body: z.object({
      groupId: z.string().uuid(),
      result: z.enum(['GOOD_WIN', 'EVIL_WIN']),
      winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).optional(),
      notes: z.string().optional(),
      participants: z.array(
        z.object({
          userId: z.string().uuid(),
          role: z.enum([
            'MERLIN',
            'PERCIVAL',
            'GOOD_SIMPLE',
            'ASSASSIN',
            'MORGANA',
            'MORDRED',
            'OBERON',
            'EVIL_SIMPLE',
          ]),
          faction: z.enum(['GOOD', 'EVIL']),
        }),
      ),
    }),
    response: { 201: z.object({ id: z.string().uuid() }) },
  },
  getById: {
    tags: ['Games'],
    description: 'Get game by ID with participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: z.object({
        id: z.string().uuid(),
        groupId: z.string().uuid(),
        result: z.enum(['GOOD_WIN', 'EVIL_WIN']),
        winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).nullable(),
        notes: z.string().nullable(),
        playedAt: z.string(),
        participants: z.array(
          z.object({
            userId: z.string().uuid(),
            role: z.enum([
              'MERLIN',
              'PERCIVAL',
              'GOOD_SIMPLE',
              'ASSASSIN',
              'MORGANA',
              'MORDRED',
              'OBERON',
              'EVIL_SIMPLE',
            ]),
            faction: z.enum(['GOOD', 'EVIL']),
          }),
        ),
      }),
    },
  },
  updateById: {
    tags: ['Games'],
    description: 'Update game details or participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      result: z.enum(['GOOD_WIN', 'EVIL_WIN']).optional(),
      winType: z.enum(['THREE_MISSIONS', 'ASSASSINATION']).optional(),
      notes: z.string().optional(),
      participants: z
        .array(
          z.object({
            userId: z.string().uuid(),
            role: z.enum([
              'MERLIN',
              'PERCIVAL',
              'GOOD_SIMPLE',
              'ASSASSIN',
              'MORGANA',
              'MORDRED',
              'OBERON',
              'EVIL_SIMPLE',
            ]),
            faction: z.enum(['GOOD', 'EVIL']),
          }),
        )
        .optional(),
    }),
    response: { 204: z.null() },
  },
  deleteById: {
    tags: ['Games'],
    description: 'Delete game and its participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    response: { 204: z.null() },
  },
};
