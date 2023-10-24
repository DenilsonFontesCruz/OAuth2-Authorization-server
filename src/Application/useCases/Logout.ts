import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { ICacheManager } from '../../Infrastructure/IServices/ICacheManager';
import { VerifyAuth } from './VerifyAuth';

interface LogoutInput {
  token: string;
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
      token: input.token,
    });

    if (result.isFailure) {
      return result as Result<DomainError>;
    }

    await this.cacheManager.set(input.token, '');

    return Result.ok('Logout completed');
  }
}
