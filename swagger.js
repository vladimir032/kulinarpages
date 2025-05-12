const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Кулинар API',
      version: '1.0.0',
      description: 'API документация для Kulinar-main',
      contact: {
        name: 'Кулинар',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API сервер',
      },
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-auth-token',
          description: 'JWT. Добавьте токен с префиксом в заголовок x-auth-token.'
        },
      },
    },
    security: [
      {
        apiKeyAuth: [],
      },
    ],
  },
  apis: [
    './swagger/*.js',
    './routes/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/kulinar_diplom-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/kulinar_diplom-api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation available at /kulinar_diplom-api-docs');
}

module.exports = { setupSwagger };
