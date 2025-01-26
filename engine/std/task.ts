import { Result } from "thrix/std/result.ts";
import { Option } from "thrix/std/option.ts";

export type TaskResult<T, U> = Promise<Result<T, U>>;
export type TaskOption<T> = Promise<Option<T>>;

export const ofResult = <T, U>(result: Result<T, U>): TaskResult<T, U> => Promise.resolve(result);

export const ofPromise = <T, U>(promise: Promise<T>, onCatch: (err: any) => U): TaskResult<T, U> =>
    promise.then((data) => Result.ok<T, U>(data))
        .catch(err => Result.err<T, U>(onCatch(err)));