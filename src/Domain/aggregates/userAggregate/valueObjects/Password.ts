import { Checker } from '../../../../../Utils/Checker';
import { ClientErrorCodes } from '../../../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../../../Utils/Result';
import { DomainError } from '../../../../../Utils/domain/DomainError';
import { ValueObject } from '../../../../../Utils/domain/ValueObject';

interface PasswordProps {
  password: string;
}

export class InvalidPasswordFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): InvalidPasswordFormatError {
    return new InvalidPasswordFormatError(message);
  }
}

export type PasswordResponse = Result<Password | Result<DomainError>>;

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  getValue(): string {
    return this.props.password;
  }

  private static isPasswordFormatValid(name: string): boolean {
    const passwordRegex = new RegExp(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]/,
    );

    return passwordRegex.test(name);
  }

  public static create(password: string): PasswordResponse {
    if (Checker.isNullOrUndefined(password)) {
      return Result.fail(
        InvalidPasswordFormatError.create(
          'Password cannot be null or undefined',
        ),
      );
    }

    if (!Checker.stringInRange(password, 8, 64)) {
      return Result.fail(
        InvalidPasswordFormatError.create(
          'Password must have a minimum of 8 and a maximum of 64 characters',
        ),
      );
    }

    if (!this.isPasswordFormatValid(password)) {
      return Result.fail(
        InvalidPasswordFormatError.create(
          'Format not accepted, Must contain uppercase and lowercase characters and number',
        ),
      );
    }

    return Result.ok<Password>(new Password({ password }));
  }
}
