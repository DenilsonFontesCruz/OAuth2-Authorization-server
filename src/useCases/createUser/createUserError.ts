import { Result } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';

export class AlreadyRegisteredUserError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): AlreadyRegisteredUserError {
    return new AlreadyRegisteredUserError(message);
  }
}

export class UserDetailsError extends Result<DomainError> {
  private constructor(message: string, error: any) {
    super(false, {
      message,
      error,
    });
  }

  public static create(message: string, error: any): UserDetailsError {
    return new UserDetailsError(message, error);
  }
}
