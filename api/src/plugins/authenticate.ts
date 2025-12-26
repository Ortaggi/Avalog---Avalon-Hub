import { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticate(
  request: FastifyRequest & { jwtVerify: () => Promise<void> }, // precisa tipar aqui
  reply: FastifyReply,
) {
  try {
    console.log('Autenticador chamado ✅');
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
