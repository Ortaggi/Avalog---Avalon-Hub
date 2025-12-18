import { z } from 'zod';

export const schemaGroups = {
  getAll: {
    tags: ['Groups'],
    description: 'List all groups',
    security: [{ BearerAuth: [] }],
    response: {
      200: z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
      ),
    },
  },
  getById: {
    tags: ['Groups'],
    description: 'Get group by id',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: z.object({
        id: z.string().uuid(),
        name: z.string(),
      }),
    },
  },
  create: {
    tags: ['Groups'],
    description: 'Create a new group',
    security: [{ BearerAuth: [] }],
    body: z.object({
      name: z.string().min(3),
      adminId: z.string().uuid(),
    }),
    response: {
      201: z.object({ id: z.string().uuid() }),
    },
  },
  update: {
    tags: ['Groups'],
    description: 'Update group name',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    body: z.object({ name: z.string().min(3) }),
    response: { 204: z.null() },
  },
  delete: {
    tags: ['Groups'],
    description: 'Delete a group and all memberships',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    response: { 204: z.null() },
  },
  addMember: {
    tags: ['Groups'],
    description: 'Add member to group',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      userId: z.string().uuid(),
      role: z.enum(['ADMIN', 'MEMBER']).optional(),
    }),
    response: { 201: z.null() },
  },
  removeMember: {
    tags: ['Groups'],
    description: 'Remove member from group',
    security: [{ BearerAuth: [] }],
    params: z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    }),
    response: { 204: z.null() },
  },
  getMembersInGroup: {
    tags: ['Groups'],
    description: 'List all members of a group',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.string().uuid() }),
    response: {
      200: z.array(
        z.object({
          id: z.string().uuid(),
          email: z.string().email(),
          nickname: z.string().nullable(),
          role: z.enum(['ADMIN', 'MEMBER']),
        }),
      ),
    },
  },
};
