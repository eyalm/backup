import traceInit from 'tsgs-tracer';
traceInit();
import { measureRequestDuration } from 'tsgs-metrics';
import { loggerService } from 'tsgs-logger';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { whoAmI, WhoAmI } from './who-am-i';
import swaggerSetup from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerService,
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );
  const droneManagerApp: WhoAmI = whoAmI();
  swaggerSetup(app, droneManagerApp);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  app.use(measureRequestDuration);
  const port = configService.get('port');
  try {
    await app.listen(port, () => logger.log(`Listening on port ${port}`));
  } catch (error) {
    logger.error(
      `Failed to start application on port ${port}: ${error.message}`,
    );
    throw error;
  }
}
bootstrap();
