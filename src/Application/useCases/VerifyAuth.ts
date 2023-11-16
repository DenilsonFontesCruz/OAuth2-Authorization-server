import { Checker } from '../../../Domain-Driven-Design-Types/Checker';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import { IJwtManager } from '../../Infrastructure/IServices/IJwtManager';

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

export class TokenExpired extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Unauthorized,
    });
  }

  public static create(message: string): TokenExpired {
    return new TokenExpired(message);
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

interface VerifyAuthInput {
  acessToken: string;
}

type VerifyAuthOutput = Result<DomainError> | Result<Identifier>;

export class VerifyAuth implements IUseCase<VerifyAuthInput, VerifyAuthOutput> {
  private cacheManager: ICacheManager;
  private jwtManager: IJwtManager<Identifier>;

  constructor(
    cacheManager: ICacheManager,
    jwtManager: IJwtManager<Identifier>,
  ) {
    this.cacheManager = cacheManager;
    this.jwtManager = jwtManager;
  }

  async execute(input: VerifyAuthInput): Promise<VerifyAuthOutput> {
    if (Checker.isNullOrUndefined(input.acessToken)) {
      return TokenNotProvided.create('Token not provided');
    }

    if (await this.cacheManager.contain(input.acessToken)) {
      return TokenInvalid.create('Token not valid');
    }

    const tokenBody = this.jwtManager.verify(input.acessToken);

    if ((tokenBody.expiresAt as number) * 1000 < Date.now()) {
      return TokenExpired.create('Token expired');
    }

    return Result.ok(tokenBody.payload);
  }
}
