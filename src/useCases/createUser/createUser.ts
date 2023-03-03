import { ICrypter } from '../../components/cypher/ICrypter';
import { Email } from '../../domain/user/email';
import { HashPassword } from '../../domain/user/hashPassword';
import { Name } from '../../domain/user/name';
import { Password } from '../../domain/user/password';
import { User } from '../../domain/user/user';
import { IUserRepository } from '../../repository/IUserRepositorory';
import { UnexpectedError } from '../../shared/core/commonError';
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
  private crypter: ICrypter;

  constructor(userRepo: IUserRepository, crypter: ICrypter) {
    this.userRepo = userRepo;
    this.crypter = crypter;
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

    const passwordObject = passwordOrError.value.getValue() as Password;

    const hashPassword = await this.crypter.encrypt(passwordObject.getValue(), {
      salt: 10,
      secret: 'SampleText',
    });

    const hashPasswordOrError = HashPassword.create(hashPassword);

    if (hashPasswordOrError.isFail()) {
      return fail(hashPasswordOrError.value);
    }

    const userOrError = User.create({
      name: nameOrError.value.getValue() as Name,
      email: emailOrError.value.getValue() as Email,
      password: hashPasswordOrError.value.getValue() as HashPassword,
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
