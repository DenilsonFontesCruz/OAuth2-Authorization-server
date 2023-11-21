import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { IUserRepository } from '../../Application/repositories/IUserRepository';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import { IHasher } from '../../Infrastructure/IServices/IHasher';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';

export interface IDependencies {
  userRepository: IUserRepository;
  cacheManager: ICacheManager;
  hasher: IHasher;
  jwtManager: IJwtManager<Identifier>;
}

export interface IDependenciesManager {
  start: () => Promise<IDependencies> | IDependencies;
}
