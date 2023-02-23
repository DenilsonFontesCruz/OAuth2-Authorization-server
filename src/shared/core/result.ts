export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: T;
  private _value?: T;

  public constructor(isSuccess: boolean, error?: T, value?: T) {
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

  public getValue(): T | undefined {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead.",
      );
    }

    return this._value;
  }

  public errorValue(): T {
    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: U): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine<T>(results: Result<T>[]): Result<T> {
    for (let result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<T>();
  }

  public static combineResponse<F, S>(
    responses: (Fail<F, S> | Sucess<F, Result<any>>)[],
  ): Response<F, Result<any>> {
    for (let response of responses) {
      if (response.isFail()) return response as Fail<F, any>;
    }
    return sucess(Result.ok<any>());
  }
}

export type Response<F, S> = Fail<F, S> | Sucess<F, S>;

export class Fail<F, S> {
  readonly value: F;

  constructor(value: F) {
    this.value = value;
  }

  isFail(): this is Fail<F, S> {
    return true;
  }

  isSucess(): this is Sucess<F, S> {
    return false;
  }
}

export class Sucess<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFail(): this is Fail<F, S> {
    return false;
  }

  isSucess(): this is Sucess<F, S> {
    return true;
  }
}

export const fail = <F, S>(l: F): Response<F, S> => {
  return new Fail(l);
};

export const sucess = <F, S>(a: S): Response<F, S> => {
  return new Sucess<F, S>(a);
};
