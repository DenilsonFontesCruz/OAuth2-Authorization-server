import { Server } from './Server';
import { ProdDependencies } from './Config/Dependencies/ProdDependencies';
import { UseCasesManager } from './Config/UseCasesManager';

start();

async function start(): Promise<void> {
  try {
    const {
      SERVER_PORT,
      MONGO_HOST,
      REDIS_HOST,
      REDIS_PORT,
      HASHER_SALT,
      JWT_MANAGER_SECRET,
      ACESS_TOKEN_DURATION,
      REFRESH_TOKEN_DURATION,
    } = process.env;

    const dependenciesManager = new ProdDependencies({
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

    const server = new Server(useCasesInstances, Number(SERVER_PORT));

    await server.start();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}
