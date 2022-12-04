import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

const CONFIG_FILE_PATH = `${process.cwd()}/config/config.yaml`;

function configuration(): Record<string, any> {
  return yaml.load(readFileSync(CONFIG_FILE_PATH, 'utf8')) as Record<
    string,
    any
  >;
}

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  cache: true,
  load: [configuration],
});
