import createError from 'http-errors';
import { SWAGGER_PATH } from '../constants/index.js';
import swaggerUiExpress from 'swagger-ui-express';
import fs from 'node:fs';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDoc)];
  } catch {
    return (req, res, next) =>
      next(createError(500, "Can't load swagger docs"));
  }
};
