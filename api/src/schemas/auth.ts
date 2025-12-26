import { z } from 'zod';

export const schemaAuth = {
  register: {
    tags: ['Auth'],
    description: 'Register new user',
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      nickname: z.string().optional(),
    }),
    response: {
      201: z.object({
        id: z.string(),
        email: z.string(),
      }),
    },
  },
  login: {
    tags: ['Auth'],
    description: 'Login with credentials',

    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    response: {
      200: z.object({
        token: z.string(),
      }),
    },
  },
};
