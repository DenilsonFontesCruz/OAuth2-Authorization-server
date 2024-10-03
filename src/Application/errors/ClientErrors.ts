import { DomainError } from '../../../Utils/domain/DomainError';
import { ClientErrorCodes } from '../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../Utils/Result';

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

export class UserNotFound extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.NotFound,
    });
  }

  public static create(message: string): UserNotFound {
    return new UserNotFound(message);
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

export class EmailAlredyRegisteredError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): EmailAlredyRegisteredError {
    return new EmailAlredyRegisteredError(message);
  }
}

export class IdAlredyRegisteredError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): IdAlredyRegisteredError {
    return new IdAlredyRegisteredError(message);
  }
}

export class UserAlredyHavePermissionError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): UserAlredyHavePermissionError {
    return new UserAlredyHavePermissionError(message);
  }
}

export class PermissionAlredyRegisteredError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): PermissionAlredyRegisteredError {
    return new PermissionAlredyRegisteredError(message);
  }
}

export class InvalidCredentialsError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Forbidden,
    });
  }

  public static create(message: string): InvalidCredentialsError {
    return new InvalidCredentialsError(message);
  }
}

export class PermissionNotFoundError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.NotFound,
    });
  }

  public static create(message: string): PermissionNotFoundError {
    return new PermissionNotFoundError(message);
  }
}
