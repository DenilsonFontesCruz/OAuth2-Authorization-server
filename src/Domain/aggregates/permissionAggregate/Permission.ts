import { Identifier } from '../../../../Utils/Generics';
import { ClientErrorCodes } from '../../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../../Utils/Result';
import { AggregateRoot } from '../../../../Utils/domain/Aggregate';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { PermissionCreatedEvent } from './events/PermissionCreatedEvent';

export enum PermissionStatus {
  Enabled = 1,
  Disabled = 2,
}

export interface PermissionProps {
  name: string;
  status: PermissionStatus;
}

export class PermissionDetailsNullError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): PermissionDetailsNullError {
    return new PermissionDetailsNullError(message);
  }
}

type PermissionResponse = Result<Permission | Result<DomainError>>;

export class Permission extends AggregateRoot<PermissionProps> {
  private constructor(props: PermissionProps, id: Identifier) {
    super(props, id);
  }

  getStatus(): PermissionStatus {
    return this.props.status;
  }

  getName(): string {
    return this.props.name;
  }

  public static recovery(permissionProps: PermissionProps, id: Identifier): Permission {
    return new Permission(permissionProps, id);
  }

  public static create(permissionProps: PermissionProps, id: Identifier): PermissionResponse {
    const permission = new Permission(permissionProps, id);

    permission.AddDomainEvent(new PermissionCreatedEvent(permission));

    return Result.ok<Permission>(permission);
  }
}
