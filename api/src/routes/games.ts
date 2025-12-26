import { FastifyTypedInstance } from '../types/fastify.js';
import { authenticate } from '../plugins/authenticate.js';
import { schemaGames } from '../schemas/games.js';
import {
  createGame,
  deleteGame,
  getGameById,
  getGames,
  updateGame,
} from '../controllers/gamesController.js';

export async function gamesRoutes(app: FastifyTypedInstance) {
  app.get(
    '/',
    {
      preHandler: [authenticate],
      schema: schemaGames.getAll,
    },
    async () => getGames(),
  );

  app.post(
    '/',
    {
      preHandler: [authenticate],
      schema: schemaGames.create,
    },
    async (request, reply) => {
      const game = await createGame(request.body);
      return reply.status(201).send({ id: game.id });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: schemaGames.getById,
    },
    async (request) => getGameById(request.params.id),
  );

  app.put(
    '/:id',
    {
      preHandler: [authenticate],
      schema: schemaGames.updateById,
    },
    async (request, reply) => {
      await updateGame(request.params.id, request.body);
      return reply.status(204).send();
    },
  );

  app.delete(
    '/:id',
    {
      preHandler: [authenticate],
      schema: schemaGames.deleteById,
    },
    async (request, reply) => {
      await deleteGame(request.params.id);
      return reply.status(204).send();
    },
  );
}
