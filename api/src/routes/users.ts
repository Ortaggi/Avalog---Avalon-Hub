import z from 'zod';
import { FastifyTypedInstance } from '../types/fastify.js';
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usersController.js';
import { authenticate } from '../plugins/authenticate.js';
import { schemaUsers } from '../schemas/users.js';

export async function usersRoutes(app: FastifyTypedInstance) {
  app.get(
    '/',
    {
      preHandler: [authenticate],
      schema: schemaUsers.getAll,
    },
    async () => {
      return getUsers();
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: schemaUsers.getById,
    },
    async (request) => {
      return getUserById(request.params.id);
    },
  );

  app.put(
    '/:id',
    { preHandler: [authenticate], schema: schemaUsers.updateById },
    async (request, reply) => {
      await updateUser(request.params.id, request.body);
      return reply.status(204).send();
    },
  );

  app.delete(
    '/:id',
    { preHandler: [authenticate], schema: schemaUsers.deleteById },
    async (request, reply) => {
      await deleteUser(request.params.id);
      return reply.status(204).send();
    },
  );
}
