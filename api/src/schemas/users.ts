import { z } from 'zod';

export const schemaUsers = {
  getAll: {
    tags: ['Users'],
    description: 'List all users',
    security: [{ BearerAuth: [] }],
    response: {
      200: z.array(
        z.object({
          id: z.string().uuid(),
          email: z.string().email(),
          nickname: z.string().nullable(),
          avatarUrl: z.string().nullable(),
        }),
      ),
    },
  },
  getById: {
    tags: ['Users'],
    description: 'Get user by id',
    security: [{ BearerAuth: [] }],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        nickname: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    },
  },
  updateById: {
    tags: ['Users'],
    description: 'Update user profile',
    security: [{ BearerAuth: [] }],
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      nickname: z.string().optional(),
      avatarUrl: z.string().url().optional(),
    }),
    response: {
      204: z.null(),
    },
  },
  deleteById: {
    tags: ['Users'],
    description: 'Delete user',
    security: [{ BearerAuth: [] }],
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      204: z.null(),
    },
  },
};
