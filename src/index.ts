import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { IManager, IManagerResult } from './config/Database/IManager';
import { MongoManager } from './config/Database/MongoDB';
import { RedisManager } from './config/Database/Redis';
import { configEnviroment } from './config/Env/EnviromentManager';

const argv = yargs(hideBin(process.argv)).parseSync();

if (!argv['env']) {
  process.exit();
}

start(argv['env'] as string);

async function start(envName: string): Promise<void> {
  const env = configEnviroment(envName);
  const mongo = new MongoManager(env.database.mongoConfig);
  const redis = new RedisManager(env.database.redisConfig);

  startDatabase([mongo, redis]);
}

async function startDatabase(
  databaseList: IManager<unknown, unknown>[],
): Promise<IManagerResult<unknown>[]> {
  return Promise.all(
    databaseList.map(async (database) => {
      try {
        const result = await database.start();

        if (!result.connection) {
          console.error('Database not started');
          process.exit();
        }

        return result;
      } catch (err) {
        console.error(err);
        process.exit();
      }
    }),
  );
}
