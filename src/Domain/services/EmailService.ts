import { ClientErrorCodes } from '../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../Domain-Driven-Design-Types/Result';
import { DomainError } from '../../../Domain-Driven-Design-Types/domain/DomainError';
import { Email } from '../aggregates/userAggregate/valueObjects/Email';
import { IUserRepository } from '../repository/UserRepository/IUserRepository';

export class AlreadyRegisteredUserError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.Conflict,
    });
  }

  public static create(message: string): AlreadyRegisteredUserError {
    return new AlreadyRegisteredUserError(message);
  }
}

export class EmailService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async UniquenessVerify(
    email: Email,
  ): Promise<Result<AlreadyRegisteredUserError | void>> {
    if (!(await this.userRepository.findByEmail(email.getValue()))) {
      return Result.fail(
        AlreadyRegisteredUserError.create('E-mail alredy in use'),
      );
    }
    return Result.ok();
  }
}
