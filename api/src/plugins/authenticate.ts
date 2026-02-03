import { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticate(
  request: FastifyRequest & { jwtVerify: () => Promise<void> }, // precisa tipar aqui
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    console.log('Authentication failed ❌', err);
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
