import { Name } from './name';
import { Email } from './email';
import { Password } from './password';
import { Entity } from '../../shared/domain/entity';
import { fail, Response, Result, sucess } from '../../shared/core/result';
import { Guard } from '../../shared/core/guard';
import { DomainError } from '../../shared/domain/domainError';
import { Permission } from './permission';

interface UserProps {
  name: Name;
  email: Email;
  password: Password;
  permissions?: Permission[];
}

export class UserDetailsNullError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
    });
  }

  public static create(message: string): UserDetailsNullError {
    return new UserDetailsNullError(message);
  }
}


type UserResponse = Response<UserDetailsNullError, Result<User>>;

export class User extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  getName() {
    return this.props.name;
  }

  getEmail() {
    return this.props.email;
  }

  public static create(userProps: UserProps): UserResponse {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: userProps.email, argumentName: 'Email' },
      { argument: userProps.name, argumentName: 'Name' },
      { argument: userProps.password, argumentName: 'Password' },
    ]);

    if (!guardResult.succeeded) {
      return fail(UserDetailsNullError.create(guardResult.message));
    }
    return sucess(Result.ok<User>(new User(userProps)));
  }
}
