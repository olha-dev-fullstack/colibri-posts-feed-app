import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { onRequest } from 'firebase-functions/v2/https';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  await app.init();
};
export const api = onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
