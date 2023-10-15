import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { IUserRepository } from '../repositories/IUserRepository';
import { IHasher } from '../IServices/IHasher';
import { IJwtManager } from '../IServices/IJwtManager';
import { Identifier } from '../../../Domain-Driven-Design-Types/Generics';

export class EmailNotFoundError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.NotFound,
    });
  }

  public static create(message: string): EmailNotFoundError {
    return new EmailNotFoundError(message);
  }
}

export class PasswordIncorrectError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Unauthorized,
    });
  }

  public static create(message: string): PasswordIncorrectError {
    return new PasswordIncorrectError(message);
  }
}

interface ClientLoginInput {
  email: string;
  password: string;
}

type ClientLoginOutput = Result<DomainError> | Result<string>;

export class ClientLogin
  implements IUseCase<ClientLoginInput, ClientLoginOutput>
{
  private userRepo: IUserRepository;
  private hasher: IHasher;
  private jwtManager: IJwtManager<Identifier>;

  constructor(
    userRepo: IUserRepository,
    hasher: IHasher,
    jwtManager: IJwtManager<Identifier>,
  ) {
    this.userRepo = userRepo;
    this.hasher = hasher;
    this.jwtManager = jwtManager;
  }

  async execute(input: ClientLoginInput): Promise<ClientLoginOutput> {
    const user = await this.userRepo.findByEmail(input.email);

    if (!user) {
      return EmailNotFoundError.create('Email unregistered');
    }

    if (!(await this.hasher.compare(input.password, user.getPassword()))) {
      return PasswordIncorrectError.create('Password incorrect');
    }

    const token = this.jwtManager.sign(user.id);

    return Result.ok<string>(token);
  }
}
