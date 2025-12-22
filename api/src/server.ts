import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyStatic } from '@fastify/static';
import { routes } from './routes/routes.js';
import jwtPlugin from '@fastify/jwt';
import { swaggerOptions, swaggerUiOptions } from './plugins/swagger.js';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = Number(process.env.PORT) || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Error: missing JWT_SECRET in environment');
  process.exit(1);
}

// Export for fastify-cli
export default async function (app: any, opts: any) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(jwtPlugin, { secret: JWT_SECRET });
  app.register(fastifyCors, { origin: '*' });
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);

  // Serve static files from the Angular build directory
  const clientPath = path.join(__dirname, '../../client/dist');

  // Also serve static assets directly (without prefix)
  app.register(fastifyStatic, {
    root: clientPath,
    prefix: '/',
    decorateReply: false,
  });

  app.register(routes);
}

// For development, create and start the server directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Process argv: ', process.argv);
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  async function start() {
    try {
      // Register plugins
      await app.register(await import('./server.js').then((m) => m.default));
      await app.listen({ port: PORT, host: '0.0.0.0' });
      console.log(`✅ HTTP Server Running on port ${PORT}`);
      console.log(`📄 Swagger UI: http://localhost:${PORT}/docs`);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  }
  start();
}
