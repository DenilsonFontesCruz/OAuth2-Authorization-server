import { describe, expect, test } from 'vitest';
import { stringGeneratorBySize } from '../../tools/stringGeneratorBySize';
import { Email, InvalidEmailFormatError } from './email';
import { InvalidNameFormatError, Name } from './name';
import { InvalidPasswordFormatError, Password } from './password';

describe('Email details wrong', () => {
  test('Email format wrong, should return InvalidEmailFormatError', async () => {
    const email = Email.create('john.com');

    expect(email.value).toBeInstanceOf(InvalidEmailFormatError);
  });

  test('Email size wrong, should return InvalidEmailFormatError', async () => {
    const emailBelowLimit = Email.create(
      stringGeneratorBySize(1, '', '@g.com'),
    );

    expect(emailBelowLimit.value).toBeInstanceOf(InvalidEmailFormatError);

    const emailAboveLimit = Email.create(
      stringGeneratorBySize(80, '', '@gmail.com'),
    );

    expect(emailAboveLimit.value).toBeInstanceOf(InvalidEmailFormatError);
  });
});

describe('Name details wrong', () => {
  test('Name format wrong, should return InvalidNameFormatError', async () => {
    const name = Name.create('john12');

    expect(name.value).toBeInstanceOf(InvalidNameFormatError);
  });

  test('Name size wrong, should return InvalidNameFormatError', async () => {
    const nameBelowLimit = Name.create(stringGeneratorBySize(1));

    expect(nameBelowLimit.value).toBeInstanceOf(InvalidNameFormatError);

    const nameAboveLimit = Name.create(stringGeneratorBySize(61));

    expect(nameAboveLimit.value).toBeInstanceOf(InvalidNameFormatError);
  });
});

describe('Password details wrong', () => {
  test('Password format wrong, should return InvalidPasswordFormatError', async () => {
    const password = Password.create('john1234');

    expect(password.value).toBeInstanceOf(InvalidPasswordFormatError);
  });

  test('Password size wrong, should return InvalidPasswordFormatError', async () => {
    const passwordBelowLimit = Password.create(stringGeneratorBySize(1));

    expect(passwordBelowLimit.value).toBeInstanceOf(InvalidPasswordFormatError);

    const passwordAboveLimit = Password.create(stringGeneratorBySize(65));

    expect(passwordAboveLimit.value).toBeInstanceOf(InvalidPasswordFormatError);
  });
});
