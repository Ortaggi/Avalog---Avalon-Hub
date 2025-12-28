import { loginUser, registerUser } from '../controllers/authController.js';
import { getUserById } from '../controllers/usersController.js';
import { LoginRequestUserType, RegisterRequestUserType } from '../dtos/user.js';
import { authenticate } from '../plugins/authenticate.js';
import { schemaAuth } from '../schemas/auth.js';
import { FastifyTypedInstance } from '../types/fastify.js';

export async function authRoutes(app: FastifyTypedInstance) {
  app.post<{ Body: RegisterRequestUserType }>(
    '/register',
    {
      schema: schemaAuth.register,
    },
    async (request, reply) => {
      const user = await registerUser(request.body);
      return reply.status(201).send({ id: user.id, email: user.email });
    }
  );

  app.post<{ Body: LoginRequestUserType }>(
    '/login',
    {
      schema: schemaAuth.login,
    },
    async (request, reply) => {
      const token = await loginUser(request.body, app);
      return reply.status(200).send({ token });
    }
  );

  app.get(
    '/me',
    {
      preValidation: (request, reply, done) => {
        authenticate(request, reply).then(() => done());
      },
      schema: schemaAuth.me,
    },
    async (request, reply) => {
      console.debug('Request user: ', request.user);
      const requestUser = request.user as { id: string; email: string };
      const user = await getUserById(requestUser.id);
      return reply.status(200).send(user);
    }
  );
  app.get(
    '/logout',
    {
      preValidation: (request, reply, done) => {
        authenticate(request, reply).then(() => done());
      },
    },
    async (request, reply) => {
      // Implement logout logic here
      return reply.status(200).send({ message: 'Logged out successfully' });
    }
  );
}
