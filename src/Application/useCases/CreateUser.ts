import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { IUseCase } from '../../../Domain-Driven-Design-Types/application/IUseCase';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { IUserRepository } from '../repositories/IUserRepository';
import { PasswordHash } from './PasswordHash';

interface CreateUserInput {
  email: string;
  password: string;
}

type CreateUserOutput = Result<void | Result<DomainError>>;

export class CreateUser implements IUseCase<CreateUserInput, CreateUserOutput> {
  private userRepo: IUserRepository;
  private passwordHash: PasswordHash;

  execute(input: CreateUserInput): Promise<CreateUserOutput> {
    
  }
}
