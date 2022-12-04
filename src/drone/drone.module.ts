import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from 'tsgs-kafka-module';
import { HttpModule } from '@nestjs/axios';
import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';

@Module({
  imports: [
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        brokers: [configService.get('kafka.broker')],
      }),
    }),
    HttpModule,
  ],
  controllers: [DroneController],
  providers: [DroneService],
})
export class DroneModule {}
