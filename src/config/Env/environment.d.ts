declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //Database
      //Mongo
      MONGO_HOST: string;
      REDIS_HOST: string;
      //Redis
      REDIS_PORT: number;

      //Services
      //Hasher
      HASHER_SALT: number;
      //JwtManager
      JWT_MANAGER_SECRET: string;

      //Server
      SERVER_PORT: number;

      //UseCases
      //ClientLogin & TokenLogin
      ACESS_TOKEN_DURATION: number;
      REFRESH_TOKEN_DURATION: number;
    }
  }
}

export {};