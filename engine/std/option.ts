export class Option<T> {
  readonly value?: T;
  private readonly _tag: "Some" | "None";

  private constructor(value?: T) {
    this.value = value;
    this._tag = value !== undefined ? "Some" : "None";
  }

  static none<T>(): Option<T> {
    return new Option<T>();
  }

  static some<T>(value: T): Option<T> {
    return new Option<T>(value);
  }

  isSome(): boolean {
    return this._tag === "Some";
  }

  isNone(): boolean {
    return this._tag === "None";
  }

  unwrap(): T {
    if (this._tag === "None") {
      throw new Error("Option is None");
    }
    return this.value!;
  }

  unwrapOr(defaultValue: T): T {
    return this._tag === "None" ? defaultValue : this.value!;
  }
}