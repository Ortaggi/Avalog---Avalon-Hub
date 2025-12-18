import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { routes } from './routes/routes.js';
import fastifyJwt from '@fastify/jwt';
import { swaggerOptions, swaggerUiOptions } from './plugins/swagger.js';

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

app.register(routes);

app.listen({ port: PORT }).then(() => {
  console.log(`✅ HTTP Server Running on port ${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/docs`);
});
