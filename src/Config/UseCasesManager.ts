import { ClientLogin } from '../Application/useCases/Auth/ClientLogin';
import { CreateUser } from '../Application/useCases/User/CreateUser';
import { Logout } from '../Application/useCases/Auth/Logout';
import { TokenLogin } from '../Application/useCases/Auth/TokenLogin';
import { VerifyAuth } from '../Application/useCases/Auth/VerifyAuth';
import { IDependencies } from './Dependencies/IDependencies';

export interface ITokensDuration {
  acessTokenDuration: number;
  refreshTokenDuration: number;
}

export interface IUseCasesInstances {
  clientLogin: ClientLogin;
  createUser: CreateUser;
  logout: Logout;
  tokenLogin: TokenLogin;
  verifyAuth: VerifyAuth;
}

export class UseCasesManager {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  start(tokensDuration: ITokensDuration): IUseCasesInstances {
    const clientLogin = new ClientLogin(
      this.dependencies.userRepository,
      this.dependencies.hasher,
      this.dependencies.jwtManager,
      this.dependencies.cacheManager,
      {
        acessTokenDuration: tokensDuration.acessTokenDuration,
        refreshTokenDuration: tokensDuration.refreshTokenDuration,
      },
    );

    const createUser = new CreateUser(
      this.dependencies.userRepository,
      this.dependencies.hasher,
    );

    const tokenLogin = new TokenLogin(
      this.dependencies.jwtManager,
      this.dependencies.cacheManager,
      {
        acessTokenDuration: tokensDuration.acessTokenDuration,
        refreshTokenDuration: tokensDuration.refreshTokenDuration,
      },
    );

    const verifyAuth = new VerifyAuth(
      this.dependencies.cacheManager,
      this.dependencies.jwtManager,
    );

    const logout = new Logout(verifyAuth, this.dependencies.cacheManager);

    return {
      clientLogin,
      createUser,
      logout,
      tokenLogin,
      verifyAuth,
    };
  }
}
