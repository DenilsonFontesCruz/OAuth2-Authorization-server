import { PermissionTypes } from '../../enums/permissionEnum';
import { Response, Result, sucess } from '../../shared/core/result';
import { DomainError } from '../../shared/domain/domainError';
import { ValueObject } from '../../shared/domain/valueObject';

interface PermissionProps {
  permission: PermissionTypes;
}

export class InvalidPermissionError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): InvalidPermissionError {
    return new InvalidPermissionError(message);
  }
}

type PermissionResponse = Response<InvalidPermissionError, Result<Permission>>;

export class Permission extends ValueObject<PermissionProps> {
  private constructor(props: PermissionProps) {
    super(props);
  }

  getValue() {
    return this.props.permission;
  }

  public static create(permission: PermissionTypes): PermissionResponse {
    return sucess(Result.ok<Permission>(new Permission({ permission })));
  }
}
