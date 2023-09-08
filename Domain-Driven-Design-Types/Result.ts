export class Result<ValueT> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error?: ValueT;
  private _value?: ValueT;

  public constructor(isSuccess: boolean, error?: ValueT, value?: ValueT) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): ValueT | undefined {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        'Can´t get the value of an error result. Use ´errorValue´ instead.',
      );
    }

    return this._value;
  }

  public errorValue(): ValueT | undefined {
    if (!this.isFailure) {
      console.log(this.error);
      throw new Error(
        'Can´t get the error of an value result. Use ´getValue´ instead.',
      );
    }

    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: U): Result<U> {
    return new Result<U>(false, error);
  }

  public static verifyError<T>(results: Result<T>[]): Result<T> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
