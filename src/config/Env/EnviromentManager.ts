import { IEnviroment } from './IEnviroment';
import { DevEnviroment } from './DevEnviroment';

const EnviromentList: IEnviroment[] = [DevEnviroment];

export function configEnviroment(envName: string): IEnviroment {
  const env = EnviromentList.find((env) => {
    return env.name === envName;
  });
  if (!env) {
    console.error('Enviroment Not Found');
    process.exit();
  }
  return env;
}
