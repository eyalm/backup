import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { WhoAmI } from './who-am-i';

@ApiTags('Utils')
@Controller()
export class AppController {
  private readonly logger: Logger;

  constructor(private readonly appService: AppService) {
    this.logger = new Logger(this.constructor.name);
  }

  @Get('whoami')
  getWhoAmI(): WhoAmI {
    return this.appService.getWhoAmI();
  }
}
