import { v4 as uuidv4 } from 'uuid';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { User } from '../../Domain/aggregates/userAggregate/User';
import { Email } from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import { Nickname } from '../../Domain/aggregates/userAggregate/valueObjects/Nickname';
import { Password } from '../../Domain/aggregates/userAggregate/valueObjects/Password';
import { IUserRepository } from '../repositories/IUserRepository';
import { IHasher } from '../tools/IHasher';

export class EmailAlredyRegisteredError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): EmailAlredyRegisteredError {
    return new EmailAlredyRegisteredError(message);
  }
}

export class IdAlredyRegisteredError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): IdAlredyRegisteredError {
    return new IdAlredyRegisteredError(message);
  }
}

interface CreateUserInput {
  id?: Identifier;
  nickname: string;
  email: string;
  password: string;
}

type CreateUserOutput = void | Result<DomainError>;

export class CreateUser implements IUseCase<CreateUserInput, CreateUserOutput> {
  private userRepo: IUserRepository;
  private hasher: IHasher;

  constructor(userRepo: IUserRepository, hasher: IHasher) {
    this.userRepo = userRepo;
    this.hasher = hasher;
  }

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const nicknameOrError = Nickname.create(input.nickname);
    const emailOrError = Email.create(input.email);
    const passwordOrError = Password.create(input.password);

    const result = Result.verifyError<
      Nickname | Email | Password | Result<DomainError>
    >([nicknameOrError, emailOrError, passwordOrError]);

    if (result.isFailure) {
      result.errorValue() as Result<DomainError>;
    }

    if (input.id && (await this.userRepo.findById(input.id))) {
      return IdAlredyRegisteredError.create(
        `Id: ${input.id} Already in use, please try another`,
      );
    }

    if (await this.userRepo.findById(input.email)) {
      return EmailAlredyRegisteredError.create(
        `Email: ${input.email} Already in use, please try another`,
      );
    }

    const hashPassword = await this.hasher.encrypt(
      passwordOrError.getValue()?.getValue() as string,
    );

    const userOrError = User.create({
      id: input.id ?? uuidv4(),
      nickname: nicknameOrError.getValue() as Nickname,
      email: emailOrError.getValue() as Email,
      password: hashPassword,
    });

    if (userOrError.isFailure) {
      return userOrError.errorValue() as Result<DomainError>;
    }

    await this.userRepo.save(userOrError.getValue() as User);
  }
}
