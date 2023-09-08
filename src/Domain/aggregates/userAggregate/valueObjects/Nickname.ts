import { Checker } from '../../../../../Domain-Driven-Design-Types/Checker';
import { ClientErrorCodes } from '../../../../../Domain-Driven-Design-Types/ResponseCodes';
import { Result } from '../../../../../Domain-Driven-Design-Types/Result';
import { DomainError } from '../../../../../Domain-Driven-Design-Types/domain/DomainError';
import { ValueObject } from '../../../../../Domain-Driven-Design-Types/domain/ValueObject';

interface NicknameProps {
  nickname: string;
}

export class InvalidNicknameFormatError extends Result<DomainError> {
  private constructor(message: string) {
    super(false, {
      message,
      code: ClientErrorCodes.BadRequest,
    });
  }

  public static create(message: string): InvalidNicknameFormatError {
    return new InvalidNicknameFormatError(message);
  }
}

export type NicknameResponse = Result<Nickname | Result<DomainError>>;

export class Nickname extends ValueObject<NicknameProps> {
  private constructor(props: NicknameProps) {
    super(props);
  }

  getValue(): string {
    return this.props.nickname;
  }

  private static isNicknameFormatValid(nickname: string): boolean {
    const nicknameRegex = new RegExp(
      /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]|[0-9]/,
    );

    return nicknameRegex.test(nickname);
  }

  public static create(nickname: string): NicknameResponse {
    if (Checker.isNullOrUndefined(nickname)) {
      return Result.fail(
        InvalidNicknameFormatError.create(
          'Nickname cannot be null or undefined',
        ),
      );
    }

    if (!Checker.stringInRange(nickname, 3, 60)) {
      return Result.fail(
        InvalidNicknameFormatError.create(
          'Nickname must have a minimum of 3 and a maximum of 60 characters',
        ),
      );
    }

    if (this.isNicknameFormatValid(nickname)) {
      return Result.fail(
        InvalidNicknameFormatError.create(
          'Format not accepted, The use of numbers or special characters is not allowed',
        ),
      );
    }
    return Result.ok<Nickname>(new Nickname({ nickname }));
  }
}
