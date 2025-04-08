import BaseMiddleware from '../core/BaseMiddleware.js';
import {getEnv, log} from '../core/utils.js';
import swaggerJsdoc from 'swagger-jsdoc';

import user from '../swagger-docs/user.js';
import category from '../swagger-docs/category.js';

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: getEnv('SWAGGER_TITLE'),
        version: getEnv('SWAGGER_VERSION'),
      },
      servers: [
        {
          url: getEnv('API_URL'),
        },
      ],
    },
    apis:[],
    swaggerDefinition:{
      paths : {
        ...user,
        ...category,
      }
    }
};

export default swaggerJsdoc(options);
