import { Guard } from '../../shared/core/guard';
import { fail, Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface NameProps {
  name: string;
}

export class InvalidNameFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidNameFormatError {
    return new InvalidNameFormatError(message);
  }
}

type NameResponse = Response<InvalidNameFormatError, Result<Name>>;

export class Name extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  getValue() {
    return this.props.name;
  }

  private static isNameFormatValid(name: string): boolean {
    const emailRegex = new RegExp(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]|[0-9]/);

    return emailRegex.test(name);
  }

  public static create(name: string): NameResponse {
    const guardResult = Guard.inRange(name.length, 3, 60, 'Name');

    if (!guardResult.succeeded) {
      return fail(InvalidNameFormatError.create(guardResult.message));
    }
    if (this.isNameFormatValid(name)) {
      return fail(
        InvalidNameFormatError.create(
          'Format not accepted, The use of numbers or special characters is not allowed',
        ),
      );
    }
    return sucess(Result.ok<Name>(new Name({ name })));
  }
}
