import { z } from 'zod';
import { GroupDetailResponse, GroupMemberRequest, GroupMemberResponse, GroupRequest, GroupResponse, GroupUpdateRequest } from '../dtos/group.js';

export const schemaGroups = {
  getAll: {
    tags: ['Groups'],
    description: 'List all groups',
    security: [{ BearerAuth: [] }],
    response: {
      200: z.array(GroupResponse),
    },
  },
  getById: {
    tags: ['Groups'],
    description: 'Get group by id',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    response: {
      200: GroupDetailResponse
    },
  },
  create: {
    tags: ['Groups'],
    description: 'Create a new group',
    security: [{ BearerAuth: [] }],
    body: GroupRequest,
    response: {
      201: z.object({ id: z.uuid() }),
    },
  },
  update: {
    tags: ['Groups'],
    description: 'Update group name',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    body: GroupUpdateRequest,
    response: { 204: z.null() },
  },
  delete: {
    tags: ['Groups'],
    description: 'Delete a group and all memberships',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    response: { 204: z.null() },
  },
  addMember: {
    tags: ['Groups'],
    description: 'Add member to group',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    body: GroupMemberRequest,
    response: { 201: z.null() },
  },
  removeMember: {
    tags: ['Groups'],
    description: 'Remove member from group',
    security: [{ BearerAuth: [] }],
    params: z.object({
      id: z.uuid(),
      userId: z.uuid(),
    }),
    response: { 204: z.null() },
  },
  getMembersInGroup: {
    tags: ['Groups'],
    description: 'List all members of a group',
    security: [{ BearerAuth: [] }],
    params: z.object({ id: z.uuid() }),
    response: {
      200: z.array(GroupMemberResponse),
    },
  },
};
