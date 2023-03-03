import { Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface HashPasswordProps {
  hashPassword: string;
}

export class InvalidHashPasswordError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidHashPasswordError {
    return new InvalidHashPasswordError(message);
  }
}

type HashPasswordResponse = Response<
  InvalidHashPasswordError,
  Result<HashPassword>
>;

export class HashPassword extends ValueObject<HashPasswordProps> {
  private constructor(props: HashPasswordProps) {
    super(props);
  }

  getValue() {
    return this.props.hashPassword;
  }

  public static create(hashPassword: string): HashPasswordResponse {
    return sucess(Result.ok<HashPassword>(new HashPassword({ hashPassword })));
  }
}
