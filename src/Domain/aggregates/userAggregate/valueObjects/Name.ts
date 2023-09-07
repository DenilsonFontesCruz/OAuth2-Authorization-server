import { Checker } from '../../../../../Domain-Driven-Design-Types/Checker';
import { ClientErrorCodes } from '../../../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../../../Domain-Driven-Design-Types/Result';
import { DomainError } from '../../../../../Domain-Driven-Design-Types/domain/DomainError';
import { ValueObject } from '../../../../../Domain-Driven-Design-Types/domain/ValueObject';

interface NameProps {
  name: string;
}

export class InvalidNameFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): InvalidNameFormatError {
    return new InvalidNameFormatError(message);
  }
}

type NameResponse = Result<Name | Result<DomainError>>;

export class Name extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  getValue(): string {
    return this.props.name;
  }

  private static isNameFormatValid(name: string): boolean {
    const emailRegex = new RegExp(
      /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]|[0-9]/,
    );

    return emailRegex.test(name);
  }

  public static create(name: string): NameResponse {
    if (Checker.isNullOrUndefined(name)) {
      return Result.fail(
        InvalidNameFormatError.create('Name cannot be null or undefined'),
      );
    }

    if (!Checker.stringInRange(name, 3, 60)) {
      return Result.fail(
        InvalidNameFormatError.create(
          'Name must have a minimum of 3 and a maximum of 60 characters',
        ),
      );
    }

    if (this.isNameFormatValid(name)) {
      return Result.fail(
        InvalidNameFormatError.create(
          'Format not accepted, The use of numbers or special characters is not allowed',
        ),
      );
    }
    return Result.ok<Name>(new Name({ name }));
  }
}
