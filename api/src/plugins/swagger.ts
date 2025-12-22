import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import pkg from '../../package.json' with { type: 'json' };

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  transform: jsonSchemaTransform,
  openapi: {
    info: {
      title: pkg.name,
      version: pkg.version,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
};

export const swaggerUiOptions = {
  routePrefix: '/api/docs',
  uiConfig: {
    deepLinking: true,
  },
};
