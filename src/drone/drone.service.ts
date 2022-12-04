import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerService, ProducerService } from 'tsgs-kafka-module';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FlightAltimeterSettingCommand } from 'tsgs-stanag-types';
import { checkForRealityID } from '../utils';
import { FlightLocationStateMsgDto } from './dtos';

export const latLongCheck = (requestedFields: string[]) => {
  const [latitude, longitude] = ['latitude', 'longitude'];
  if (!requestedFields.includes(latitude)) requestedFields.push(latitude);
  if (!requestedFields.includes(longitude)) requestedFields.push(longitude);
  return requestedFields;
};

const metadata = {
  header: 'header',
  flightLocationState: 'flightLocationState',
};

@Injectable()
export class DroneService implements OnModuleInit {
  private readonly logger: Logger;
  private flightInfraEndPoint: string;
  private readonly publishTopic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
    private httpService: HttpService,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.publishTopic = this.configService.get('kafka.publishTopic');
    this.flightInfraEndPoint = this.configService.get(
      'flightInfraManager.baseUrl',
    );
  }

  async onModuleInit() {
    const { groupId, downlinkTopic } = this.configService.get('kafka');
    try {
      await this.consumerService.consume(
        groupId,
        [downlinkTopic],
        async ({ topic, message }) => {
          const realityId = checkForRealityID(
            message.headers?.realityId?.toString(),
          );
          const receivedMessage = message.value.toString();
          const receivedMessageAsJson = JSON.parse(receivedMessage);
          const { tailNumber } = receivedMessageAsJson.header;
          const coordinate = this.parseDroneCoordinateFromVsm(
            receivedMessageAsJson,
          );
          if (coordinate === undefined) return;
          this.logger.debug(
            `consume messages from topic ${topic}: ${receivedMessage}`,
          );

          const barometricPressure =
            await this.getDroneBarometricPressureByCoordinate(
              coordinate,
              realityId,
            );

          await this.publishBarometricPressureToDrone(
            barometricPressure,
            realityId,
            tailNumber,
          );
        },
      );
    } catch (error) {
      this.logger.error(
        `Unable to consume from kafka topic ${downlinkTopic}: ${error.message}`,
      );
    }
  }

  private async publishBarometricPressureToDrone(
    barometricPressure: number,
    realityId: string,
    tailNumber: string,
  ) {
    try {
      // reality ID support

      const flightAltimeterSettingCommand: FlightAltimeterSettingCommand = {
        altimeterSetting: barometricPressure,
      };

      const messageHeader = {
        header: {
          tailNumber,
          timeStamp: new Date().toISOString,
          messageTypeId: 201601,
        },
      };
      const flightAltimeterSettingCommandMsg = {
        messageHeader,
        flightAltimeterSettingCommand,
      };

      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        realityId,
      };
      const endPoint = `${this.flightInfraEndPoint}/get-brometric-pressure`;
      const pressure = await firstValueFrom(
        this.httpService.post(endPoint, flightAltimeterSettingCommandMsg, {
          headers: headersRequest,
        }),
      );

      this.logger.debug(
        `Succesfully Sent Command: ${JSON.stringify(pressure)}`,
      );
      return pressure.data;
    } catch (err) {
      const endPoint = `${this.flightInfraEndPoint}/get-brometric-pressure`;
      this.logger.error(
        `Couldn't reach flight infra manager at: ${endPoint}: , ${err.message}`,
      );
      throw new InternalServerErrorException(
        `Couldn't reach flight infra manager at: ${endPoint}`,
      );
    }
  }

  private parseDroneCoordinateFromVsm(
    flightLocationStateMSG: Record<string, any>,
  ): FlightLocationStateMsgDto | undefined {
    // exclude the header to check if it's state message or echo message
    let locationMsg: FlightLocationStateMsgDto;
    const dataFieldName = Object.keys(flightLocationStateMSG).find(
      (key) => key !== metadata.header,
    );
    if (dataFieldName === metadata.flightLocationState) {
      locationMsg = {
        tailNumber: flightLocationStateMSG.header.tailNumber,
        altitude: flightLocationStateMSG[dataFieldName].altitude,
        longitude: flightLocationStateMSG[dataFieldName].longitude,
        latitude: flightLocationStateMSG[dataFieldName].latitude,
      };
    }
    return locationMsg;
  }

  async getDroneBarometricPressureByCoordinate(
    coordinate: FlightLocationStateMsgDto,
    realityId: string,
  ): Promise<number> {
    try {
      //  get the barometric pressure for coordinate
      const payload = {
        longitude: coordinate.longitude,
        latitude: coordinate.latitude,
      };
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        realityId,
      };
      const endPoint = `${this.flightInfraEndPoint}/get-brometric-pressure`;
      const pressure = await firstValueFrom(
        this.httpService.post(endPoint, payload, { headers: headersRequest }),
      );

      this.logger.debug(`Succesfully Sent Command: ${JSON.stringify(payload)}`);
      return pressure.data;
    } catch (err) {
      const endPoint = `${this.flightInfraEndPoint}/get-brometric-pressure`;
      this.logger.error(
        `Couldn't reach flight infra manager at: ${endPoint}: , ${err.message}`,
      );
      throw new InternalServerErrorException(
        `Couldn't reach flight infra manager at: ${endPoint}`,
      );
    }
  }
}
