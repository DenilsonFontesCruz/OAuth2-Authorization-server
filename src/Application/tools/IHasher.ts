import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';

export interface IHasher {
  encrypt(text: string, salt: number): Promise<string | Result<DomainError>>;

  compare(text: string, hashedText: string): Promise<boolean>;
}
