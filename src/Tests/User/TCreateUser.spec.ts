import { describe, expect, test } from 'vitest';
import { Hasher } from '../../Application/services/Hasher';
import {
  InvalidNicknameFormatError,
  Nickname,
} from '../../Domain/aggregates/userAggregate/valueObjects/Nickname';
import {
  Email,
  InvalidEmailFormatError,
} from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import {
  InvalidPasswordFormatError,
  Password,
} from '../../Domain/aggregates/userAggregate/valueObjects/Password';
import { stringGeneratorBySize } from '../tools/stringGeneratorBySize';
import { CreateUser } from '../../Application/useCases/CreateUser';
import { TUserRepository } from '../Mock/Repositories/TUserRepository';

describe('Services tests', () => {
  test('Hash', async () => {
    const plaintext = 'hello';
    const saltRounds = 1;
    const hasher = new Hasher(saltRounds);

    const hashPlaintext = await hasher.encrypt(plaintext);

    expect(hashPlaintext).not.instanceOf(Error);
    expect(hashPlaintext).not.equal(plaintext);
  });
});

describe('Nickname validation tests', () => {
  test('Correct Nickname', () => {
    const text = 'John';
    const result = Nickname.create(text);
    const nickname = result.getValue();

    expect(result.isSuccess).toBeTruthy();
    expect(nickname?.getValue()).equal(text);
  });
  test('Small Nickname', () => {
    const text = stringGeneratorBySize(2);
    const result = Nickname.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNicknameFormatError);
  });
  test('Big Nickname', () => {
    const text = stringGeneratorBySize(61);
    const result = Nickname.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNicknameFormatError);
  });
  test('Null Nickname', () => {
    const text = '';
    const result = Nickname.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNicknameFormatError);
  });
  test('Special characters in Nickname', () => {
    const text = 'J@hn';
    const result = Nickname.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNicknameFormatError);
  });
});

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
  test('Correct scenario', async () => {
    const hasher = new Hasher(1);
    const userRepo = new TUserRepository([]);
    const createUser = new CreateUser(userRepo, hasher);

    const result = await createUser.execute({
      nickname: 'john',
      email: 'john@gmail.com',
      password: 'John1234',
    });

    expect(result).toBeUndefined();
    expect(await userRepo.getSaveCount()).equal(1);
  });
});
