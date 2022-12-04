import { Body, Controller, Logger, Post, Headers } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { checkForRealityID } from '../utils';
import { DroneService } from './drone.service';
import { FlightLocationStateMsgDto } from './dtos';

@ApiTags('Barometric-Pressure')
@Controller()
export class DroneController {
  private readonly logger: Logger;

  constructor(private readonly droneService: DroneService) {
    this.logger = new Logger(this.constructor.name);
  }

  @ApiOperation({
    summary: 'Get Barometric Pressure for coordinate.',
    description:
      'This is a post request because it excepts body of the requested fields.',
  })
  @ApiCreatedResponse({
    description: 'brometric pressure',
  })
  @ApiHeader({ name: 'realityId', required: true, example: 'ID-123' })
  @ApiBody({ type: FlightLocationStateMsgDto })
  @Post('all')
  async getAllDrones(
    @Body() point: FlightLocationStateMsgDto,
    @Headers('realityId') realityId = 'default',
  ) {
    const realityID = checkForRealityID(realityId);
    return this.droneService.getDroneBarometricPressureByCoordinate(
      point,
      realityID,
    );
  }
}
