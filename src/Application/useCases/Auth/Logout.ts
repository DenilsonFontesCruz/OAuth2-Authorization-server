import { Result } from '../../../../Utils/Result';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { ICacheManager } from '../../../Infrastructure/IServices/ICacheManager';
import { VerifyAuth } from './VerifyAuth';

interface LogoutInput {
  acessToken: string;
  refreshToken: string;
}

type LogoutOutput = Result<DomainError> | Result<string>;

export class Logout implements IUseCase<LogoutInput, LogoutOutput> {
  private verifyAuth: VerifyAuth;
  private cacheManager: ICacheManager;

  constructor(verifyAuth: VerifyAuth, cacheManager: ICacheManager) {
    this.verifyAuth = verifyAuth;
    this.cacheManager = cacheManager;
  }

  async execute(input: LogoutInput): Promise<LogoutOutput> {
    const result = await this.verifyAuth.execute({
      acessToken: input.acessToken,
    });

    if (result.isFailure) {
      return result as Result<DomainError>;
    }

    await this.cacheManager.set(input.acessToken, '');
    await this.cacheManager.remove(input.refreshToken);

    return Result.ok('Logout completed');
  }
}
