import { describe, expect, test } from 'vitest';
import { CrypterTest } from '../../components/cypher/CrypterTest';
import { User } from '../../domain/user/user';
import { UserRepositoryTest } from '../../repository/UserRepositoryTest';
import { Sucess } from '../../shared/core/result';
import { CreateUser } from './createUser';
import { AlreadyRegisteredUserError } from './createUserError';

describe('Create a New User', () => {
  test('Correct user details, should return Sucess and save User', async () => {
    const userRepo = new UserRepositoryTest([]);
    const crypter = new CrypterTest();

    const createUser = new CreateUser(userRepo, crypter);

    const userDetails = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'JOhn1234',
    };

    const result = await createUser.execute(userDetails);

    expect(result).toBeInstanceOf(Sucess);

    expect(userRepo.getTimesSaveCalled()).equal(1);
  });

  test('Email alredy in use, should return AlreadyRegisteredUserError', async () => {
    const userRepo = new UserRepositoryTest([]);
    const crypter = new CrypterTest();

    const createUser = new CreateUser(userRepo, crypter);

    const userDetails = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'JOhn1234',
    };

    await createUser.execute(userDetails);

    const result = await createUser.execute(userDetails);

    expect(result.value).toBeInstanceOf(AlreadyRegisteredUserError);

    expect(userRepo.getTimesSaveCalled()).equal(1);
  });

  test('Password encryption, encrypted password should be diffent of passed password', async () => {
    const userRepo = new UserRepositoryTest([]);
    const crypter = new CrypterTest();

    const createUser = new CreateUser(userRepo, crypter);

    const userDetails = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'JOhn1234',
    };

    const result = await createUser.execute(userDetails);

    const user = await userRepo.findByEmail(userDetails.email);

    const hashPassword = (user as User).getPassword();

    expect(hashPassword.getValue()).not.toEqual(userDetails.password);
  });

  test('password comparison should return true if the same password is passed', async () => {
    const crypter = new CrypterTest();

    const password = 'password';

    const hashPassword = await crypter.encrypt(password, {
      salt: 10,
      secret: 'SampleText',
    });

    console.log(hashPassword);

    expect(await crypter.compare(password, hashPassword)).toBeTruthy();
  });
});
