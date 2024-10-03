import { Identifier } from '../../../../Utils/Generics';
import { ClientErrorCodes } from '../../../../Utils/constantes/ResponseCodes';
import { Result } from '../../../../Utils/Result';
import { AggregateRoot } from '../../../../Utils/domain/Aggregate';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { Email } from './valueObjects/Email';

export interface UserProps {
  email: Email;
  password: string;
  permissionsId: Array<Identifier>;
}

export class UserDetailsNullError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): UserDetailsNullError {
    return new UserDetailsNullError(message);
  }
}

type UserResponse = Result<User | Result<DomainError>>;

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id: Identifier) {
    super(props, id);
  }

  getEmail(): Email {
    return this.props.email;
  }

  getPassword(): string {
    return this.props.password;
  }

  getPermissionsId(): Array<Identifier> {
    return this.props.permissionsId;
  }

  public static recovery(userProps: UserProps, id: Identifier): User {
    return new User(userProps, id);
  }

  public static create(userProps: UserProps, id: Identifier): UserResponse {
    const user = new User(userProps, id);

    return Result.ok<User>(user);
  }

  public assignPermission(permissionId: Identifier): boolean {
    if (!this.props.permissionsId.includes(permissionId)) {
      this.props.permissionsId.push(permissionId);
      return true;
    }
    return false;
  }

  public removePermission(permissionId: Identifier): boolean {
    if (this.props.permissionsId.includes(permissionId)) {
      const index = this.props.permissionsId.indexOf(permissionId);
      if (index > -1) {
        this.props.permissionsId.splice(index, 1);
        return true;
      }
    }
    return false;
  }
}
