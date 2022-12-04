import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WhoAmI } from '../who-am-i';

export default function swaggerSetup(app, appDetails: WhoAmI) {
  const config = new DocumentBuilder()
    .setTitle('Flight Drone Manager')
    .setDescription(appDetails.appDescription)
    .setVersion(appDetails.appVersion)
    .addTag(appDetails.appName)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
