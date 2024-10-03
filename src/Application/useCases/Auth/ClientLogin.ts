import { ClientErrorCodes } from '../../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../../Utils/Result';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IHasher } from '../../../Infrastructure/IServices/IHasher';
import { IJwtManager } from '../../../Infrastructure/IServices/IJwtManager';
import { Checker } from '../../../../Utils/Checker';
import { ICacheManager } from '../../../Infrastructure/IServices/ICacheManager';
import crypto from 'crypto';
import { ITokensDuration } from '../../../Config/UseCasesManager';
import UserTokenPayload from '../../../../Utils/UserTokenPayload';
import { IPermissionRepository } from '../../repositories/IPermissionRepository';
import { DataNotProvided, EmailNotFoundError, PasswordIncorrectError } from '../../errors/ClientErrors';

interface ClientLoginInput {
  email: string;
  password: string;
}

export interface ClientLoginOutputBody {
  acessToken: string;
  refreshToken: string;
}

type ClientLoginOutput = Result<DomainError> | Result<ClientLoginOutputBody>;

export class ClientLogin
  implements IUseCase<ClientLoginInput, ClientLoginOutput>
{
  private userRepo: IUserRepository;
  private permissionRepo: IPermissionRepository;
  private hasher: IHasher;
  private jwtManager: IJwtManager<UserTokenPayload>;
  private cacheManager: ICacheManager;
  private tokensDuration: ITokensDuration;

  constructor(
    userRepo: IUserRepository,
    permissionRepo: IPermissionRepository,
    hasher: IHasher,
    jwtManager: IJwtManager<UserTokenPayload>,
    cacheManager: ICacheManager,
    tokensDuration: ITokensDuration,
  ) {
    this.userRepo = userRepo;
    this.permissionRepo = permissionRepo;
    this.hasher = hasher;
    this.jwtManager = jwtManager;
    this.cacheManager = cacheManager;
    this.tokensDuration = tokensDuration;
  }

  async execute(input: ClientLoginInput): Promise<ClientLoginOutput> {
    if (Checker.isNullOrUndefined(input.email)) {
      DataNotProvided.create('Email not provided');
    }

    if (Checker.isNullOrUndefined(input.password)) {
      DataNotProvided.create('Password not provided');
    }

    const user = (await this.userRepo.findByEmail(input.email))[0];

    if (!user) {
      return EmailNotFoundError.create('Email unregistered');
    }

    if (!(await this.hasher.compare(input.password, user.getPassword()))) {
      return PasswordIncorrectError.create('Password incorrect');
    }

    const permissions = [];
    
    for(const permissionId of user.getPermissionsId()) {
      const permission = await this.permissionRepo.findById(permissionId);
      if(permission !== null) {
        permissions.push(permission.getName());
      }
    }

    const payload: UserTokenPayload = {
      id: user.id,
      permissions: permissions,
    };

    const acessToken = this.jwtManager.sign(
      payload,
      this.tokensDuration.acessTokenDuration * 1000,
    );
    const refreshToken = crypto.randomBytes(16).toString('hex');

    this.cacheManager.set(
      refreshToken,
      user.id.toString(),
      this.tokensDuration.refreshTokenDuration * 1000,
    );

    return Result.ok<ClientLoginOutputBody>({ acessToken, refreshToken });
  }
}
