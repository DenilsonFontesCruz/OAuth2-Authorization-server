import { v4 as uuidv4 } from 'uuid';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';
import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { User } from '../../Domain/aggregates/userAggregate/User';
import { Email } from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import { Password } from '../../Domain/aggregates/userAggregate/valueObjects/Password';
import { IUserRepository } from '../repositories/IUserRepository';
import { IHasher } from '../../Infrastructure/IServices/IHasher';

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
  email: string;
  password: string;
}

type CreateUserOutput = Result<DomainError> | Result<string>;

export class CreateUser implements IUseCase<CreateUserInput, CreateUserOutput> {
  private userRepo: IUserRepository;
  private hasher: IHasher;

  constructor(userRepo: IUserRepository, hasher: IHasher) {
    this.userRepo = userRepo;
    this.hasher = hasher;
  }

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const emailOrError = Email.create(input.email);
    const passwordOrError = Password.create(input.password);

    const result = Result.verifyError<Email | Password | Result<DomainError>>([
      emailOrError,
      passwordOrError,
    ]);

    if (result.isFailure) {
      return result.errorValue() as Result<DomainError>;
    }

    if (input.id && (await this.userRepo.findById(input.id))) {
      return IdAlredyRegisteredError.create(
        `Id: ${input.id} Already in use, please try another`,
      );
    }

    if ((await this.userRepo.findByEmail(input.email)).length > 0) {
      return EmailAlredyRegisteredError.create(
        `Email: ${input.email} Already in use, please try another`,
      );
    }

    try {
      const hashPassword = await this.hasher.encrypt(
        passwordOrError.getValue()?.getValue() as string,
      );

      const userOrError = User.create({
        id: input.id ?? uuidv4(),
        email: emailOrError.getValue() as Email,
        password: hashPassword,
      });

      if (userOrError.isFailure) {
        return userOrError.errorValue() as Result<DomainError>;
      }
      await this.userRepo.save(userOrError.getValue() as User);

      return Result.ok<string>('User created');
    } catch (error) {
      console.log('Create User catch:', error);
      throw error;
    }
  }
}
