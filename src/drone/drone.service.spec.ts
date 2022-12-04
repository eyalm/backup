import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService, ProducerService } from 'tsgs-kafka-module';
import { UaState } from 'tsgs-stanag-types';
import { RedisService } from '../redis/redis.service';
import { DroneService } from './drone.service';
import { configMock, consumerMock } from '../../test/mocks';
import { Drone } from './dtos';
import {
  CommunicationStatus,
  ConfigurationId,
  FlightPlanStatus,
  FlightMode,
  LightsMode,
} from '../redis/enums';

describe('DroneService', () => {
  let droneService: DroneService;
  let redisService: RedisService;
  const realityId = 'default';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DroneService,
        { provide: ConfigService, useFactory: configMock },
        { provide: ConsumerService, useValue: consumerMock },
      ],
    })
      .useMocker((token) => {
        switch (token) {
          case RedisService:
            return {
              getAllDrones: jest.fn(),
              getDronesByTailNumbers: jest.fn(),
              injectDroneToDB: jest.fn(),
              publishDroneForDataLayerTransformation: jest.fn(),
              getDroneForDataLayerTransformation: jest.fn(),
              flushDb: jest.fn(),
            };
          case ProducerService:
            return {
              produce: jest.fn(),
            };
          default:
            return undefined;
        }
      })
      .compile();

    droneService = module.get<DroneService>(DroneService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(droneService).toBeDefined();
  });

  it('should extract requested fields from redis db', async () => {
    const requestedFields = ['tailNumber'];

    await droneService.getAllDrones(requestedFields, realityId);

    expect(redisService.getAllDrones).toBeCalledWith(
      requestedFields,
      realityId,
    );
  });

  it('should extract requested fields of the requested drones', async () => {
    const requestedDronesWithFields = {
      tailNumbers: ['123', '456'],
      requestedFields: ['tailNumber', 'latitude', 'longitude'],
    };

    await droneService.getDronesByTailNumbers(
      requestedDronesWithFields.tailNumbers,
      requestedDronesWithFields.requestedFields,
      realityId,
    );

    expect(redisService.getDronesByTailNumbers).toBeCalledWith(
      requestedDronesWithFields.tailNumbers,
      requestedDronesWithFields.requestedFields,
      realityId,
    );
  });

  it('should add new drone to db', async () => {
    const drone: Drone = {
      tailNumber: '123',
      latitude: 45.6,
      longitude: 54.7,
      barometricAltitude: 95.3,
      communicationStatus: CommunicationStatus.HIGH,
      configurationID: ConfigurationId.medicines,
      consumerName: 'exampleConsumer',
      ctrName: '456',
      currentFuelVolume: 78,
      currentPropulsionEnergyLevel: 67.4,
      emergencyLandingPointId: '456',
      flightMode: FlightMode.NTC,
      flightPlanStatus: FlightPlanStatus.exchange,
      fuelBingoTime: 4,
      heading: 96,
      launchLandAreaName: 'farFarAway',
      lightsMode: LightsMode.ON,
      medicinesCount: 21,
      missionBingoTime: 12,
      trueAirspeed: 68.47,
      uaState: UaState.FLYING_P,
      constraint: false,
    };

    await droneService.injectDroneToDB(drone, realityId);

    expect(redisService.injectDroneToDB).toBeCalledWith(drone, realityId);
  });

  it('Should remove all drones from db', async () => {
    await droneService.flushDB(realityId);

    expect(redisService.flushDb).toBeCalled();
  });
});
