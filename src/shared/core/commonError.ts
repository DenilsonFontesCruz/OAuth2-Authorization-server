import { DomainError } from "../domain/domainError";
import { Result } from "./result";

export class UnexpectedError extends Result<DomainError> {
  private constructor(message: string, error: any) {
    super(false, {
      message,
      error,
    });
  }

  public static create(message: string, error: any): UnexpectedError {
    return new UnexpectedError(message, error);
  }
}
