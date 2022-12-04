import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis/health';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import Redis from 'ioredis';

const endpoints = {
  redisDB: 'redis.url',
  droneGateway: 'flightDroneGateway.baseUrl',
};

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {
    const redisUrl = this.configService.get('redis.url');
    this.redis = new Redis(redisUrl);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.redisIndicator.checkHealth('Redis', {
          type: 'redis',
          client: this.redis,
        }),
      async () =>
        this.http.pingCheck(
          'Flight-Drone-Gateway',
          `${this.configService.get(endpoints.droneGateway)}/whoami`,
        ),
    ]);
  }
}
