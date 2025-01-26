import { Result } from "./result.js";

export class Range {
  readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static of(value: number): Result<Range, string> {
    if (!Number.isInteger(value) || value <= 0) {
      return Result.err(`Invalid range: ${value}`);
    }
    return Result.ok(new Range(value));
  }
}
