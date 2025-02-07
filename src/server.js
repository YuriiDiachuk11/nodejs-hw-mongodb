import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
console.log('authRouter loaded');
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use((req, res, next) => {
    console.log('Request Method:', req.method, 'Request URL:', req.url);
    next();
  });
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
