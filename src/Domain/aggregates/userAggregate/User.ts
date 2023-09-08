import { Identifier } from '../../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../../Domain-Driven-Design-Types/Result';
import { AggregateRoot } from '../../../../Domain-Driven-Design-Types/domain/Aggregate';
import { DomainError } from '../../../../Domain-Driven-Design-Types/domain/DomainError';
import { UserCreatedEvent } from './events/UserCreatedEvent';
import { Email } from './valueObjects/Email';
import { Nickname } from './valueObjects/Nickname';

export interface UserProps {
  id: Identifier;
  nickname: Nickname;
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

  getId(): Identifier {
    return this.props.id;
  }

  getNickname(): Nickname {
    return this.props.nickname;
  }

  getEmail(): Email {
    return this.props.email;
  }

  getPassword(): string {
    return this.props.password;
  }

  public static create(userProps: UserProps): UserResponse {
    const user = new User(userProps);

    user.AddDomainEvent(new UserCreatedEvent(user));

    return Result.ok<User>(user);
  }
}
