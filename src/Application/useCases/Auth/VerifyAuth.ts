import { Checker } from '../../../../Utils/Checker';
import { Result } from '../../../../Utils/Result';
import { UserTokenPayload } from '../../../../Utils/UserTokenPayload';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { ICacheManager } from '../../../Infrastructure/IServices/ICacheManager';
import { IJwtManager } from '../../../Infrastructure/IServices/IJwtManager';
import { InvalidCredentialsError, TokenExpired, TokenInvalid, TokenNotProvided } from '../../errors/ClientErrors';

interface VerifyAuthInput {
  acessToken: string;
  permissions?: string[];
}

type VerifyAuthOutput = Result<DomainError> | Result<UserTokenPayload>;

export class VerifyAuth implements IUseCase<VerifyAuthInput, VerifyAuthOutput> {
  private cacheManager: ICacheManager;
  private jwtManager: IJwtManager<UserTokenPayload>;

  constructor(
    cacheManager: ICacheManager,
    jwtManager: IJwtManager<UserTokenPayload>,
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

    if (input.permissions) {
      const hasPermission = input.permissions.some((permission) =>
        tokenBody.payload.permissions.includes(permission),
      );

      if (!hasPermission) {
        return InvalidCredentialsError.create(
          'User does not have permission',
        );
      }
    }

    return Result.ok(tokenBody.payload);
  }
}
