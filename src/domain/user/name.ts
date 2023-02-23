import { Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface NameProps {
  name: string;
}

class InvalidNameFormatError extends Result<DomainError> {
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

  public static create(name: string): NameResponse {
    return sucess(Result.ok<Name>(new Name({ name })));
  }
}
