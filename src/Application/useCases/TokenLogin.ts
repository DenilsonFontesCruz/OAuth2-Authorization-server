import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Checker } from '../../../Domain-Driven-Design-Types/Checker';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import crypto from 'crypto';

export class TokenNotProvided extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.ExpectationFailed,
    });
  }

  public static create(message: string): TokenNotProvided {
    return new TokenNotProvided(message);
  }
}

export class TokenInvalid extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Unauthorized,
    });
  }

  public static create(message: string): TokenInvalid {
    return new TokenInvalid(message);
  }
}

interface TokenLoginInput {
  refreshToken: string;
}

export interface TokenLoginOutputBody {
  acessToken: string;
  refreshToken: string;
}

type TokenLoginOutput = Result<DomainError> | Result<TokenLoginOutputBody>;

export class TokenLogin implements IUseCase<TokenLoginInput, TokenLoginOutput> {
  private jwtManager: IJwtManager<Identifier>;
  private cacheManager: ICacheManager;

  constructor(
    jwtManager: IJwtManager<Identifier>,
    cacheManager: ICacheManager,
  ) {
    this.jwtManager = jwtManager;
    this.cacheManager = cacheManager;
  }

  async execute(input: TokenLoginInput): Promise<TokenLoginOutput> {
    if (Checker.isNullOrUndefined(input.refreshToken)) {
      return TokenNotProvided.create('RefreshToken not provided');
    }

    if (!(await this.cacheManager.contain(input.refreshToken))) {
      return TokenInvalid.create('Token invalid');
    }

    const item = await this.cacheManager.get(input.refreshToken);

    if (item == '' || item.value == '') {
      return TokenInvalid.create('Token invalid');
    }

    const acessToken = this.jwtManager.sign(item.value);

    const refreshToken = crypto.randomBytes(16).toString('hex');

    return Result.ok<TokenLoginOutputBody>({ acessToken, refreshToken });
  }
}
