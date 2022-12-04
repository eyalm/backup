import { Logger, Module } from '@nestjs/common';
import { loggerModule, LoggerConfig, createLoggerService } from 'tsgs-logger';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { DroneModule } from './drone/drone.module';
import { configModule } from './configuration';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    configModule,
    LoggerConfig,
    loggerModule,
    DroneModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Logger,
      useFactory: (configService: ConfigService) => {
        return createLoggerService({
          level: configService.get('log.level') ?? 'info',
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
