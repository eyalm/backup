import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { whoAmI, WhoAmI } from '../src/who-am-i';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/whoami (GET)', () => {
    const droneManager: WhoAmI = whoAmI();
    return request(app.getHttpServer())
      .get('/whoami')
      .expect(200)
      .expect({ ...droneManager }); // convert WhoAmI class to object
  });
});
