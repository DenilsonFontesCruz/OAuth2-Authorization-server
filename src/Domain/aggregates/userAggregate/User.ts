import { Identifier } from '../../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../../Domain-Driven-Design-Types/Result';
import { AggregateRoot } from '../../../../Domain-Driven-Design-Types/domain/Aggregate';
import { DomainError } from '../../../../Domain-Driven-Design-Types/domain/DomainError';
import { UserCreatedEvent } from './events/UserCreatedEvent';
import { Email } from './valueObjects/Email';

export interface UserProps {
  id: Identifier;
  email: Email;
  password: string;

  //For now
  permissions?: Array<string>;
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
  private constructor(props: UserProps) {
    super(props, props.id);
  }

  getEmail(): Email {
    return this.props.email;
  }

  getPassword(): string {
    return this.props.password;
  }

  public static recovery(userProps: UserProps): User {
    return new User(userProps);
  }

  public static create(userProps: UserProps): UserResponse {
    const user = new User(userProps);

    user.AddDomainEvent(new UserCreatedEvent(user));

    return Result.ok<User>(user);
  }
}
