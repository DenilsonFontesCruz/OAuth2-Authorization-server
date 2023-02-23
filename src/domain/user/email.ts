import { Guard } from '../../shared/core/guard';
import { fail, Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface EmailProps {
  email: string;
}

class InvalidEmailFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidEmailFormatError {
    return new InvalidEmailFormatError(message);
  }
}

type EmailResponse = Response<InvalidEmailFormatError, Result<Email>>;

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  getValue() {
    return this.props.email;
  }

  private static isEmailFormatValid(email: string): boolean {
    const emailRegex = new RegExp(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi,
    );

    return emailRegex.test(email);
  }

  public static create(email: string): EmailResponse {
    const guardResult = Guard.inRange(email.length, 8, 80, 'Email');

    if (!guardResult.succeeded) {
      return fail(InvalidEmailFormatError.create(guardResult.message));
    }
    if (!this.isEmailFormatValid(email)) {
      return fail(
        InvalidEmailFormatError.create(
          'Format not accepted, email must be like this: john@gmail.com',
        ),
      );
    }
    return sucess(Result.ok<Email>(new Email({ email })));
  }
}
