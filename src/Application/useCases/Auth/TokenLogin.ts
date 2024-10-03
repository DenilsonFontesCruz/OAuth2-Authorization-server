import { Result } from '../../../../Utils/Result';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { IJwtManager } from '../../../Infrastructure/IServices/IJwtManager';
import { Checker } from '../../../../Utils/Checker';
import { ICacheManager } from '../../../Infrastructure/IServices/ICacheManager';
import crypto from 'crypto';
import { ITokensDuration } from '../../../Config/UseCasesManager';
import UserTokenPayload from '../../../../Utils/UserTokenPayload';
import { TokenInvalid, TokenNotProvided } from '../../errors/ClientErrors';

interface TokenLoginInput {
  refreshToken: string;
}

export interface TokenLoginOutputBody {
  acessToken: string;
  refreshToken: string;
}

type TokenLoginOutput = Result<DomainError> | Result<TokenLoginOutputBody>;

export class TokenLogin implements IUseCase<TokenLoginInput, TokenLoginOutput> {
  private jwtManager: IJwtManager<UserTokenPayload>;
  private cacheManager: ICacheManager;
  private tokensDuration: ITokensDuration;

  constructor(
    jwtManager: IJwtManager<UserTokenPayload>,
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

    const payload = JSON.parse(item.value);

    const acessToken = this.jwtManager.sign(
      payload,
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
