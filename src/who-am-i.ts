import { readFileSync } from 'fs';

export class WhoAmI {
  appName: string;

  appVersion: string;

  appDescription: string;

  constructor(appName: string, appVersion: string, appDescription: string) {
    this.appName = appName;
    this.appVersion = appVersion;
    this.appDescription = appDescription;
  }
}

export function whoAmI() {
  const { name, version, description } = JSON.parse(
    readFileSync(`${process.cwd()}/package.json`, 'utf-8'),
  );
  return new WhoAmI(name, version, description);
}
