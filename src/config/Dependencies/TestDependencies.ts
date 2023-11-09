import { IUserRepository } from '../../Application/repositories/IUserRepository';
import {
  ICacheManager,
  KeyValue,
} from '../../Infrastructure/IServices/ICacheManager';
import { IHasher } from '../../Infrastructure/IServices/IHasher';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';
import { Hasher } from '../../Infrastructure/services/Hasher';
import { JwtManager } from '../../Infrastructure/services/JwtManager';
import { TUserRepository } from '../../Tests/Mock/Repositories/TUserRepository';
import { TCacheManager } from '../../Tests/Mock/Services/TCacheManager';

interface IDependencies {
  SERVICES: IServices;
  REPOSITORIES: IRepositories;
}

interface IServices {
  Hasher: (salt: number) => IHasher;
  JwtManager: <T>(secret: string) => IJwtManager<T>;
  CacheManager: (cache?: KeyValue[]) => ICacheManager;
}

interface IRepositories {
  UserRepository: () => IUserRepository;
}

export const TestDependencies: IDependencies = {
  SERVICES: {
    Hasher: (salt: number) => new Hasher(salt),
    JwtManager: <T>(secret: string) => new JwtManager<T>(secret),
    CacheManager: (cache?: KeyValue[]) => new TCacheManager(cache),
  },
  REPOSITORIES: {
    UserRepository: () => new TUserRepository(),
  },
};
