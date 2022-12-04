import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis/health';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule, RedisHealthModule],
  controllers: [HealthController],
})
export class HealthModule {}
