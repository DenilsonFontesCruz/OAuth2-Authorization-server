import { Checker } from '../../../Domain-Driven-Design-Types/Checker';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { ICacheManager } from '../IServices/ICacheManager';
import { IJwtManager } from '../IServices/IJwtManager';
import { IUserRepository } from '../repositories/IUserRepository';

export class TokenNotFound extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.ExpectationFailed,
    });
  }

  public static create(message: string): TokenNotFound {
    return new TokenNotFound(message);
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

interface GetAuthInput {
  token: string;
}

type GetAuthOutput = Result<DomainError> | Result<Identifier>;

export class GetAuth implements IUseCase<GetAuthInput, GetAuthOutput> {
  private cacheManager: ICacheManager;
  private jwtManager: IJwtManager<Identifier>;

  constructor(
    cacheManager: ICacheManager,
    jwtManager: IJwtManager<Identifier>,
  ) {
    this.cacheManager = cacheManager;
    this.jwtManager = jwtManager;
  }

  async execute(input: GetAuthInput): Promise<GetAuthOutput> {
    if (Checker.isNullOrUndefined(input.token)) {
      return TokenNotFound.create('Token not found on header');
    }

    if (await this.cacheManager.contain(input.token)) {
      return TokenInvalid.create('Token not valid');
    }

    const tokenBody = this.jwtManager.verify(input.token);

    if ((tokenBody.expiresAt as number) < Date.now()) {
      return TokenExpired.create('Token expired');
    }

    return Result.ok(tokenBody.payload);
  }
}
