import { loginUser, registerUser } from '../controllers/authContoller.js';
import { schemaAuth } from '../schemas/auth.js';
import { FastifyTypedInstance } from '../types/fastify.js';

export async function authRoutes(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: schemaAuth.register,
    },
    async (request, reply) => {
      const user = await registerUser(request.body);
      return reply.status(201).send({ id: user.id, email: user.email });
    },
  );

  app.post(
    '/login',
    {
      schema: schemaAuth.login,
    },
    async (request, reply) => {
      const token = await loginUser(request.body, app);
      return { token };
    },
  );
}
