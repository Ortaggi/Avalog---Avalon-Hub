import { FastifyTypedInstance } from '../types/fastify.js';
import { schemaGroups } from '../schemas/groups.js';
import { authenticate } from '../plugins/authenticate.js';
import {
  addMember,
  createGroup,
  deleteGroup,
  getGroupById,
  getGroups,
  listMembers,
  removeMember,
  updateGroup,
} from '../controllers/groupsController.js';

export async function groupsRoutes(app: FastifyTypedInstance) {
  app.get(
    '/',
    {
      preHandler: [authenticate],
      schema: schemaGroups.getAll,
    },
    async () => getGroups(),
  );

  app.post(
    '/',
    {
      preHandler: [authenticate],
      schema: schemaGroups.create,
    },
    async (request, reply) => {
      const group = await createGroup(request.body);
      return reply.status(201).send({ id: group.id });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: schemaGroups.getById,
    },
    async (request) => getGroupById(request.params.id),
  );

  app.put(
    '/:id',
    { preHandler: [authenticate], schema: schemaGroups.update },
    async (request, reply) => {
      await updateGroup(request.params.id, request.body.name);
      return reply.status(204).send();
    },
  );

  app.delete(
    '/:id',
    { preHandler: [authenticate], schema: schemaGroups.delete },
    async (request, reply) => {
      await deleteGroup(request.params.id);
      return reply.status(204).send();
    },
  );

  app.post(
    '/:id/members',
    { preHandler: [authenticate], schema: schemaGroups.addMember },
    async (request, reply) => {
      await addMember(request.params.id, request.body);
      return reply.status(201).send();
    },
  );

  app.delete(
    '/:id/members/:userId',
    { preHandler: [authenticate], schema: schemaGroups.removeMember },
    async (request, reply) => {
      await removeMember(request.params.id, request.params.userId);
      return reply.status(204).send();
    },
  );

  app.get(
    '/:id/members',
    { preHandler: [authenticate], schema: schemaGroups.getMembersInGroup },
    async (request) => listMembers(request.params.id),
  );
}
