import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DevDependencies } from './config/Dependencies/DevDependencies';
import { Server } from './Server';
import { ProdDependencies } from './config/Dependencies/ProdDependencies';
import { configDotenv } from 'dotenv';
import path from 'path';
import { UseCasesManager } from './config/UseCasesManager';

const argv = yargs(hideBin(process.argv)).parseSync();

if (!argv['env']) {
  process.exit();
}

if (!argv['port']) {
  process.exit();
}

const DependenciesManager: {
  development: typeof DevDependencies;
  production: typeof ProdDependencies;
} = {
  development: DevDependencies,
  production: ProdDependencies,
};

start(argv['env'] as string, Number(argv['port']));

async function start(env: string, port: number): Promise<void> {
  try {
    const manager = Object.entries(DependenciesManager).find((entry) => {
      if (env == entry[0]) {
        return true;
      }
      return false;
    });

    if (!manager) {
      console.error('Env not found');
      process.exit();
    }

    configDotenv({
      path: path.join(__dirname, `/config/Env/.env.${env}`),
    });

    const {
      MONGO_HOST,
      REDIS_HOST,
      REDIS_PORT,
      HASHER_SALT,
      JWT_MANAGER_SECRET,
      ACESS_TOKEN_DURATION,
      REFRESH_TOKEN_DURATION,
    } = process.env;

    const dependenciesManager = new manager[1]({
      database: {
        mongo: {
          host: String(MONGO_HOST),
        },
        redis: {
          host: String(REDIS_HOST),
          port: Number(REDIS_PORT),
        },
      },
      services: {
        hasher: {
          salt: Number(HASHER_SALT),
        },
        jwtManager: {
          secret: String(JWT_MANAGER_SECRET),
        },
      },
    });

    const dependencies = await dependenciesManager.start();

    const useCasesManager = new UseCasesManager(dependencies);

    const useCasesInstances = useCasesManager.start({
      acessTokenDuration: Number(ACESS_TOKEN_DURATION),
      refreshTokenDuration: Number(REFRESH_TOKEN_DURATION),
    });

    const server = new Server(useCasesInstances, port);

    await server.start();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}
