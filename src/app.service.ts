import { Injectable, Logger } from '@nestjs/common';
import { WhoAmI, whoAmI } from './who-am-i';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  getWhoAmI(): WhoAmI {
    return whoAmI();
  }
}
