import { describe, expect, test } from 'vitest';
import {
  Email,
  InvalidEmailFormatError,
} from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import {
  InvalidPasswordFormatError,
  Password,
} from '../../Domain/aggregates/userAggregate/valueObjects/Password';
import { stringGeneratorBySize } from '../Mock/tools/stringGeneratorBySize';
import {
  CreateUser,
  EmailAlredyRegisteredError,
  IdAlredyRegisteredError,
} from '../../Application/useCases/CreateUser';
import { createMockUser } from '../Mock/tools/CreateMockUser';
import { TestDependencies } from '../TestDependencies';

const { SERVICES, REPOSITORIES } = TestDependencies;

describe('Email validation tests', () => {
  test('Correct Email', () => {
    const text = 'John@gmail.com';
    const result = Email.create(text);
    const email = result.getValue();

    expect(result.isSuccess).toBeTruthy();
    expect(email?.getValue()).equal(text);
  });
  test('Small Email', () => {
    const text = stringGeneratorBySize(2, '', '@gmail.com');
    const result = Email.create(text);
    const email = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(email).instanceOf(InvalidEmailFormatError);
  });
  test('Big Email', () => {
    const text = stringGeneratorBySize(129, '', '@gmail.com');
    const result = Email.create(text);
    const email = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(email).instanceOf(InvalidEmailFormatError);
  });
  test('Invalid Email', () => {
    const text = 'john.com';
    const result = Email.create(text);
    const email = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(email).instanceOf(InvalidEmailFormatError);
  });
});

describe('Password validation tests', () => {
  test('Correct Password', () => {
    const text = 'John1234';
    const result = Password.create(text);
    const password = result.getValue();

    expect(result.isSuccess).toBeTruthy();
    expect(password?.getValue()).equal(text);
  });
  test('Small Password', () => {
    const text = stringGeneratorBySize(1, 'Jo1');
    const result = Password.create(text);
    const password = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(password).instanceOf(InvalidPasswordFormatError);
  });
  test('Small Password', () => {
    const text = stringGeneratorBySize(62, 'Jo1');
    const result = Password.create(text);
    const password = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(password).instanceOf(InvalidPasswordFormatError);
  });
  test('Invalid Password (Without Upper letter)', () => {
    const text = 'john1234';
    const result = Password.create(text);
    const password = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(password).instanceOf(InvalidPasswordFormatError);
  });
  test('Invalid Password (Without Number)', () => {
    const text = 'Johnnnnn';
    const result = Password.create(text);
    const password = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(password).instanceOf(InvalidPasswordFormatError);
  });
});

describe('UseCase test', () => {
  const hasher = SERVICES['Hasher'](1);
  test('Correct scenario', async () => {
    const hasher = SERVICES['Hasher'](1);
    const userRepo = REPOSITORIES['UserRepository']();
    const createUser = new CreateUser(userRepo, hasher);

    const result = await createUser.execute({
      email: 'john@gmail.com',
      password: 'John1234',
    });

    expect(result.isSuccess).toBeTruthy();
    expect((await userRepo.findAll()).length).toBe(1);
  });

  test('Email Already in use', async () => {
    const userList = await createMockUser(1);
    const userRepo = REPOSITORIES['UserRepository']();

    await userRepo.saveMany(userList);

    const createUser = new CreateUser(userRepo, hasher);

    const result = await createUser.execute({
      email: userList[0].getEmail().getValue(),
      password: 'John1234',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(EmailAlredyRegisteredError);
    expect((await userRepo.findAll()).length).toBe(1);
  });

  test('Id Already in use', async () => {
    const userList = await createMockUser(1);
    const userRepo = REPOSITORIES['UserRepository']();
    await userRepo.saveMany(userList);

    const createUser = new CreateUser(userRepo, hasher);

    const result = await createUser.execute({
      id: userList[0].id,
      email: 'henry@gmail.com',
      password: 'Henry1234',
    });

    expect(result.isFailure).toBeTruthy();
    expect(result).instanceOf(IdAlredyRegisteredError);
    expect((await userRepo.findAll()).length).toBe(1);
  });
});
