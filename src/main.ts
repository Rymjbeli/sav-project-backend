import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [process.env.FRONTEND_PORT_1, process.env.FRONTEND_PORT_2],
    credentials: true,
  });
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        scriptSrc: ["'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'https://cdn.jsdelivr.net', 'data:'],
      },
    }),
  );

  app.useStaticAssets(path.join(__dirname, '../uploads'));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
