import { v4 as uuidv4 } from 'uuid';
import { Identifier } from '../../../../Utils/Generics';
import { Result } from '../../../../Utils/Result';
import { IUseCase } from '../../../../Utils/application/IUseCase';
import { DomainError } from '../../../../Utils/domain/DomainError';
import { User } from '../../../Domain/aggregates/userAggregate/User';
import { Email } from '../../../Domain/aggregates/userAggregate/valueObjects/Email';
import { Password } from '../../../Domain/aggregates/userAggregate/valueObjects/Password';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IHasher } from '../../../Infrastructure/IServices/IHasher';
import { EmailAlredyRegisteredError, IdAlredyRegisteredError } from '../../errors/ClientErrors';

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
        email: emailOrError.getValue() as Email,
        password: hashPassword,
        permissionsId: []
      }, input.id ?? uuidv4());

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
