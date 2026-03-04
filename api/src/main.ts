import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().get('/health', (_req, res) => res.json({ status: 'ok' }));
  await app.listen(process.env.PORT ?? 3000);
  console.log('App started on port', process.env.PORT ?? 3000);
}
bootstrap();