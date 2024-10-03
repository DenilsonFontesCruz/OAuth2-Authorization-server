import { Checker } from '../../../../../Utils/Checker';
import { ClientErrorCodes } from '../../../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../../../Utils/Result';
import { DomainError } from '../../../../../Utils/domain/DomainError';
import { ValueObject } from '../../../../../Utils/domain/ValueObject';

interface EmailProps {
  email: string;
}

export class InvalidEmailFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): InvalidEmailFormatError {
    return new InvalidEmailFormatError(message);
  }
}

export type EmailResponse = Result<Email | Result<DomainError>>;

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  getValue(): string {
    return this.props.email;
  }

  private static isEmailFormatValid(email: string): boolean {
    const emailRegex = new RegExp(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi,
    );

    return emailRegex.test(email);
  }

  public static recovery(email: string): Email {
    return new Email({
      email,
    });
  }

  public static create(email: string): EmailResponse {
    if (Checker.isNullOrUndefined(email)) {
      return Result.fail(
        InvalidEmailFormatError.create('E-mail cannot be null or undefined'),
      );
    }

    if (!Checker.stringInRange(email.split('@')[0], 3, 128)) {
      return Result.fail(
        InvalidEmailFormatError.create(
          'E-mail must have a minimum of 3 and a maximum of 128 characters',
        ),
      );
    }

    if (!this.isEmailFormatValid(email)) {
      return Result.fail(
        InvalidEmailFormatError.create(
          'Format not accepted, email must be like this: john@gmail.com',
        ),
      );
    }
    return Result.ok(new Email({ email }));
  }
}
