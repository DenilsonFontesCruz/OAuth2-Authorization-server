import { Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface PasswordProps {
  password: string;
}

class InvalidPasswordFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidPasswordFormatError {
    return new InvalidPasswordFormatError(message);
  }
}

type PasswordResponse = Response<InvalidPasswordFormatError, Result<Password>>;

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  getValue() {
    return this.props.password;
  }

  public static create(password: string): PasswordResponse {
    return sucess(Result.ok<Password>(new Password({ password })));
  }
}
