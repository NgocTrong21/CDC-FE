const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const port = process.env.PORT || 8080;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MDM API',
      description: 'Document for MDM API',
      version: '1.0.0'
    },
    servers: [{
      url: `http://localhost:${port}/v1/api`,
      description: 'Development server'
    }]
  },
  apis: ['./src/routes/*.route.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
  })
);

module.exports = router;