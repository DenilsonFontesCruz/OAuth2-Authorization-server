import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { Checker } from '../../../Domain-Driven-Design-Types/Checker';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import crypto from 'crypto';
import { ITokensDuration } from '../../config/UseCasesManager';

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
  private tokensDuration: ITokensDuration;

  constructor(
    jwtManager: IJwtManager<Identifier>,
    cacheManager: ICacheManager,
    tokensDuration: ITokensDuration,
  ) {
    this.jwtManager = jwtManager;
    this.cacheManager = cacheManager;
    this.tokensDuration = tokensDuration;
  }

  async execute(input: TokenLoginInput): Promise<TokenLoginOutput> {
    if (Checker.isNullOrUndefined(input.refreshToken)) {
      return TokenNotProvided.create('RefreshToken not provided');
    }

    if (!(await this.cacheManager.contain(input.refreshToken))) {
      return TokenInvalid.create('Token invalid A');
    }

    const item = await this.cacheManager.get(input.refreshToken);

    if (!item || item.value == '') {
      return TokenInvalid.create('Token invalid B');
    }

    await this.cacheManager.remove(input.refreshToken);

    const acessToken = this.jwtManager.sign(
      item.value,
      this.tokensDuration.acessTokenDuration * 1000,
    );

    const refreshToken = crypto.randomBytes(16).toString('hex');

    this.cacheManager.set(
      refreshToken,
      item.value.toString(),
      this.tokensDuration.refreshTokenDuration * 1000,
    );

    return Result.ok<TokenLoginOutputBody>({ acessToken, refreshToken });
  }
}
