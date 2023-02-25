import { Guard } from '../../shared/core/guard';
import { fail, Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface PasswordProps {
  password: string;
}

export class InvalidPasswordFormatError extends Result<DomainError> {
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

  private static isPasswordFormatValid(name: string): boolean {
    const emailRegex = new RegExp(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]/,
    );

    return emailRegex.test(name);
  }

  public static create(password: string): PasswordResponse {
    const guardResult = Guard.inRange(password.length, 3, 64, 'Password');

    if (!guardResult.succeeded) {
      return fail(InvalidPasswordFormatError.create(guardResult.message));
    }
    if (!this.isPasswordFormatValid(password)) {
      return fail(
        InvalidPasswordFormatError.create(
          'Format not accepted, Must contain uppercase and lowercase characters and number',
        ),
      );
    }

    return sucess(Result.ok<Password>(new Password({ password })));
  }
}
