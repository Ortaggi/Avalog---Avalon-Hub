import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyStatic } from '@fastify/static';
import { routes } from './routes/routes.js';
import fastifyJwt from '@fastify/jwt';
import { swaggerOptions, swaggerUiOptions } from './plugins/swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT);
const JWT_SECRET = process.env.JWT_SECRET;

if (!PORT || !JWT_SECRET) {
  console.error('Error: missing PORT or JWT_SECRET in environment');
  process.exit(1);
}

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyJwt.default, { secret: JWT_SECRET });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);

// Serve static files from the Angular build directory
const clientPath = path.join(__dirname, '../../client/dist/avalog-fe/browser');

// Also serve static assets directly (without prefix)
app.register(fastifyStatic, {
  root: clientPath,
  prefix: '/',
  decorateReply: false, // Avoid conflicts with the previous registration
});

app.register(routes);


app.listen({ port: PORT }).then(() => {
  console.log(`✅ HTTP Server Running on port ${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/docs`);
});
