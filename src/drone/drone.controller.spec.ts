import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConsumerService, ProducerService } from 'tsgs-kafka-module';
import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';
import {
  configMock,
  consumerMock,
  producerMock,
  redisMock,
} from '../../test/mocks';
import { RedisService } from '../redis/redis.service';
import { Drone } from './dtos';

describe('DroneController', () => {
  let controller: DroneController;
  let service: DroneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DroneService,
        { provide: ConfigService, useFactory: configMock },
        { provide: ConsumerService, useValue: consumerMock },
        { provide: ProducerService, useValue: producerMock },
        { provide: RedisService, useValue: redisMock },
      ],
      controllers: [DroneController],
    }).compile();

    controller = module.get<DroneController>(DroneController);
    service = module.get<DroneService>(DroneService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllDrones', () => {
    it('Should return an array of drones', async () => {
      const result: Drone[] = [
        { tailNumber: '123', latitude: 45.7, longitude: 79.5 },
        { tailNumber: '456', latitude: 45.7, longitude: 79.5 },
      ];
      jest
        .spyOn(service, 'getAllDrones')
        .mockImplementation(async () => result);

      const requestedFields = ['tailNumber'];
      expect(await controller.getAllDrones(requestedFields)).toBe(result);
    });
  });

  describe('getDronesByTailNumbers', () => {
    it('Should return an array of drones', async () => {
      const result = [
        { tailNumber: '123', latitude: 45, longitude: 45 },
        { tailNumber: '456', latitude: 46, longitude: 46 },
      ];
      jest
        .spyOn(service, 'getDronesByTailNumbers')
        .mockImplementation(async () => result);

      const requestedDronesWithFields = {
        tailNumbers: ['123', '456'],
        requestedFields: ['tailNumber', 'latitude', 'longitude'],
      };
      expect(
        await controller.getDronesByTailNumbers(requestedDronesWithFields),
      ).toBe(result);
    });
  });
});
