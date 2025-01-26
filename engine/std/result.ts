type Tag = "Ok" | "Err";

export class Result<T, U> {
  readonly value: T | U;
  private readonly _tag: Tag;

  private constructor(value: T | U, tag: Tag) {
    this.value = value;
    this._tag = tag;
  }

  isOk(): this is Result<T, never> {
    return this._tag === "Ok";
  }

  isErr(): this is Result<never, U> {
    return this._tag === "Err";
  }

  unwrap(): T {
    if (this._tag === "Err") {
      throw new Error("Result is Err");
    }
    return this.value as T;
  }

  unwrapOr(defaultValue: T): T {
    return this._tag === "Err" ? defaultValue : this.value as T;
  }

  static ok<T, U>(value: T): Result<T, U> {
    return new Result<T, U>(value, "Ok");
  }

  static err<T, U>(value: U): Result<T, U> {
    return new Result<T, U>(value, "Err");
  }
}
