import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { IUserRepository } from '../repositories/IUserRepository';
import { IHasher } from '../../Infrastructure/IServices/IHasher';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Checker } from '../../../Domain-Driven-Design-Types/Checker';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import crypto from 'crypto';
import { ITokensDuration } from '../../config/UseCasesManager';

export class DataNotProvided extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): DataNotProvided {
    return new DataNotProvided(message);
  }
}

export class EmailNotFoundError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.NotFound,
    });
  }

  public static create(message: string): EmailNotFoundError {
    return new EmailNotFoundError(message);
  }
}

export class PasswordIncorrectError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Unauthorized,
    });
  }

  public static create(message: string): PasswordIncorrectError {
    return new PasswordIncorrectError(message);
  }
}

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
  private hasher: IHasher;
  private jwtManager: IJwtManager<Identifier>;
  private cacheManager: ICacheManager;
  private tokensDuration: ITokensDuration;

  constructor(
    userRepo: IUserRepository,
    hasher: IHasher,
    jwtManager: IJwtManager<Identifier>,
    cacheManager: ICacheManager,
    tokensDuration: ITokensDuration,
  ) {
    this.userRepo = userRepo;
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

    const acessToken = this.jwtManager.sign(
      user.id,
      this.tokensDuration.acessTokenDuration,
    );
    const refreshToken = crypto.randomBytes(16).toString('hex');

    this.cacheManager.set(
      refreshToken,
      user.id.toString(),
      this.tokensDuration.refreshTokenDuration,
    );

    return Result.ok<ClientLoginOutputBody>({ acessToken, refreshToken });
  }
}
