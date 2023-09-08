import { Checker } from '../../../../../Domain-Driven-Design-Types/Checker';
import { ClientErrorCodes } from '../../../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../../../Domain-Driven-Design-Types/Result';
import { DomainError } from '../../../../../Domain-Driven-Design-Types/domain/DomainError';
import { ValueObject } from '../../../../../Domain-Driven-Design-Types/domain/ValueObject';

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
