import { Email } from '../../domain/user/email';
import { Name } from '../../domain/user/name';
import { Password } from '../../domain/user/password';
import { User } from '../../domain/user/user';
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
import {
  AlreadyRegisteredUserError,
  UnexpectedError,
  UserDetailsError,
} from './createUserError';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type CreateUserResponse = Response<
  UnexpectedError | AlreadyRegisteredUserError | UserDetailsError,
  Result<any>
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
      return fail(
        UserDetailsError.create('User invalid Details', combinedResponse),
      );
    }

    const userOrError = User.create({
      name: nameOrError.value.getValue() as Name,
      email: emailOrError.value.getValue() as Email,
      password: passwordOrError.value.getValue() as Password,
      permissions: [],
    });

    if (userOrError.isFail()) {
      return userOrError;
    }

    try {
      await this.userRepo.save(userOrError.value.getValue() as User);

      return sucess(Result.ok<string>('User Created'));
    } catch (error) {
      return fail(UnexpectedError.create('Error on createUser', error));
    }
  }
}
