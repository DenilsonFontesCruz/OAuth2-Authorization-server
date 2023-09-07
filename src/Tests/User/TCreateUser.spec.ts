import { describe, expect, test } from 'vitest';
import { Hasher } from '../../Application/services/Hasher';
import {
  InvalidNameFormatError,
  Name,
} from '../../Domain/aggregates/userAggregate/valueObjects/Name';
import {
  Email,
  InvalidEmailFormatError,
} from '../../Domain/aggregates/userAggregate/valueObjects/Email';
import { Password } from '../../Domain/aggregates/userAggregate/valueObjects/Password';
import { stringGeneratorBySize } from '../tools/stringGeneratorBySize';

describe('Services tests', () => {
  test('Hash', async () => {
    const plaintext = 'hello';
    const saltRounds = 1;
    const hasher = new Hasher();

    const hashPlaintext = await hasher.encrypt(plaintext, saltRounds);

    expect(hashPlaintext).not.instanceOf(Error);
    expect(hashPlaintext).not.equal(plaintext);
  });
});

describe('Name validation tests', () => {
  test('Correct Name', () => {
    const text = 'John';
    const result = Name.create(text);
    const name = result.getValue();

    expect(result.isSuccess).toBeTruthy();
    expect(name?.getValue()).equal(text);
  });
  test('Small Name', () => {
    const text = stringGeneratorBySize(2);
    const result = Name.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNameFormatError);
  });
  test('Big Name', () => {
    const text = stringGeneratorBySize(61);
    const result = Name.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNameFormatError);
  });
  test('Null Name', () => {
    const text = '';
    const result = Name.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNameFormatError);
  });
  test('Special characters in Name', () => {
    const text = 'J@hn';
    const result = Name.create(text);
    const error = result.errorValue();

    expect(result.isFailure).toBeTruthy();
    expect(error).instanceOf(InvalidNameFormatError);
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
});
