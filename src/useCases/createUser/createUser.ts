import { Email } from '../../domain/user/email';
import { Name } from '../../domain/user/name';
import { Password } from '../../domain/user/password';
import { IUserRepository } from '../../repository/IUserRepositorory';
import {
  Fail,
  fail,
  Response,
  Result,
  Sucess,
  sucess,
} from '../../shared/core/result';
import { UseCase } from '../../shared/core/useCase';
import { DomainError } from '../../shared/domain/domainError';
import { AlreadyRegisteredUserError, UnexpectedError } from './createUserError';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type CreateUserResponse = Response<
  UnexpectedError | AlreadyRegisteredUserError,
  Result<string>
>;

export class CreateUser
  implements UseCase<CreateUserInput, CreateUserResponse>
{
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async execute(input?: CreateUserInput): Promise<CreateUserResponse> {
    const existingUser = await this.userRepo.findByEmail(input.email);

    if (existingUser) {
      return fail(AlreadyRegisteredUserError.create('Email alredy in use'));
    }

    const nameOrError = Name.create(input.name);
    const emailOrError = Email.create(input.email);
    const passwordOrError = Password.create(input.password);

    const combinedResponse = Result.combineResponse([
      nameOrError,
      emailOrError,
      passwordOrError,
    ]);

    if (combinedResponse.isFail()) {
      return combinedResponse;
    }

    return sucess(Result.ok<string>('User Created'));
  }
}
