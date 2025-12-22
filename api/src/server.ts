import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyStatic } from '@fastify/static';
import { routes } from './routes/routes.js';
import type { FastifyPluginAsync } from 'fastify';
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

// Main app factory function
async function createApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  // Set compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register plugins
  await app.register(jwtPlugin as any, { secret: JWT_SECRET });
  await app.register(fastifyCors, { origin: '*' });
  await app.register(fastifySwagger, swaggerOptions);
  await app.register(fastifySwaggerUi, swaggerUiOptions);

  // Serve static files from the Angular build directory
  const clientPath = path.resolve(__dirname, '../../client/dist/avalog-fe/browser');
  await app.register(fastifyStatic, {
    root: clientPath,
    prefix: '/',
    decorateReply: false,
  });

  // Register API routes
  await app.register(routes);

  return app;
}

// Export for fastify-cli (production)
const plugin: FastifyPluginAsync = async function (fastify, opts) {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(jwtPlugin as any, { secret: JWT_SECRET });
  await fastify.register(fastifyCors, { origin: '*' });
  await fastify.register(fastifySwagger, swaggerOptions);
  await fastify.register(fastifySwaggerUi, swaggerUiOptions);

  const clientPath = path.resolve(__dirname, '../../client/dist');
  await fastify.register(fastifyStatic, {
    root: clientPath,
    prefix: '/',
    decorateReply: false,
  });

  await fastify.register(routes);
};

export default plugin;

// Development server (when run directly)
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  async function startDevelopmentServer() {
    try {
      const app = await createApp();

      await app.listen({ port: PORT, host: '0.0.0.0' });
      console.log(`✅ HTTP Server Running on port ${PORT}`);
      console.log(`📄 Swagger UI: http://localhost:${PORT}/docs`);
      console.log(`🔧 Development Mode`);
    } catch (err) {
      console.error('Failed to start development server:', err);
      process.exit(1);
    }
  }

  await startDevelopmentServer();
}
