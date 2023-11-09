import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DevDependencies } from './config/Dependencies/DevDependencies';
import { Application } from './Application';
import { ProdDependencies } from './config/Dependencies/ProdDependencies';
import { configDotenv } from 'dotenv';
import path from 'path';

const argv = yargs(hideBin(process.argv)).parseSync();

if (!argv['env']) {
  process.exit();
}

const DependenciesManager: {
  development: typeof DevDependencies;
  production: typeof ProdDependencies;
} = {
  development: DevDependencies,
  production: ProdDependencies,
};

start(argv['env'] as string);

async function start(env: string): Promise<void> {
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

    const app = new Application(dependencies);

    await app.start();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}
