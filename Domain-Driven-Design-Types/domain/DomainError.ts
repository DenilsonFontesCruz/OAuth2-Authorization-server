import { ResponseCodes } from '../ResponseCodes';

export abstract class DomainError {
  public readonly message: string;
  public readonly code: ResponseCodes;

  constructor(message: string, code: ResponseCodes) {
    this.message = message;
    this.code = code;
  }
}
