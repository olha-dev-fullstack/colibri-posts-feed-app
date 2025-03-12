import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { AppModule } from './app.module';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
};
export const api = onRequest({ maxInstances: 1 }, async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
