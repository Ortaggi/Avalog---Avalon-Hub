import { z } from 'zod';
import { GameArrayResponse, GameDetailResponse, GameFilters, GameRequest, GameResponse, GameUpdateRequest } from '../dtos/game.js';

export const schemaGames = {
  getAll: {
    tags: ['Games'],
    description: 'List all games',
    security: [{ BearerAuth: [] }],
    querystring: GameFilters,
    response: {
      200: GameArrayResponse
    },
  },
  create: {
    tags: ['Games'],
    description: 'Create a new game with participants',
    security: [{ BearerAuth: [] }],
    body: GameRequest,
    response: { 201: z.object({ id: z.uuid() }) },
  },
  getById: {
    tags: ['Games'],
    description: 'Get game by ID with participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    response: {
      200: GameDetailResponse
    },
  },
  updateById: {
    tags: ['Games'],
    description: 'Update game details or participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    body: GameUpdateRequest,
    response: { 204: z.null() },
  },
  deleteById: {
    tags: ['Games'],
    description: 'Delete game and its participants',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    response: { 204: z.object({ id: z.uuid() }) },
  },
};
