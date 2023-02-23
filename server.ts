import { app } from './app';
import dotenv from 'dotenv';
import { DatabaseManager } from './src/database/DatabaseManager';
dotenv.config();

import { MongoDB } from './src/database/MongoDB';
import { Redis } from './src/database/Redis';
import { Response, Result, sucess, fail } from './src/shared/core/result';
import { domainError } from './src/shared/domain/domainError';

const { MONGO_DATABASE_HOST, MONGO_DATABASE_PORT } = process.env;
const { REDIS_DATABASE_HOST, REDIS_DATABASE_PORT } = process.env;

const mongodb = new MongoDB({
  host: MONGO_DATABASE_HOST,
  port: MONGO_DATABASE_PORT,
});
const redis = new Redis({
  host: REDIS_DATABASE_HOST,
  port: REDIS_DATABASE_PORT,
});

const databaseManager = new DatabaseManager([mongodb, redis]);

const applicationPort = process.env.APP_PORT;





function testError(): ServerResponse {
  const error = InvalidError.create('Test Error');
  return fail(error);
}

function createUser(name?: string): ServerResponse {
  const user = { name}

  if(user.name) {
    return sucess(Result.ok(user));
  }
  else {
    return fail(InvalidError.create("Nome invalido"));
  } 
}

console.log(createUser("Denilson"));
console.log(createUser());

databaseManager.start().then(() => {
  app.listen(applicationPort, () => {
    console.log(`Server is Running on http://localhost:${applicationPort}`);
  });
});
