// nestjs
import { Test, TestingModule } from '@nestjs/testing';

// app
import { AppController } from './app.controller';
import { AppService } from './app.service';

// other
import { WhoAmI, whoAmI } from './who-am-i';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    const droneManager: WhoAmI = whoAmI();
    it('should return app name, app version and app description', () => {
      expect(appController.getWhoAmI()).toStrictEqual(droneManager);
    });
  });
});
