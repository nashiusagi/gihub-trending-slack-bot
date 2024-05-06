export type Bindings = {
  SLACK_BOT_ACCESS_TOKEN: string;
  SLACK_BOT_ACCESS_CHANNEL: string;
};

export type Attachment = {
  title: string;
  text: string;
  author_name: string;
  color: string;
};

export type Payload = {
  channel: string;
  attachments: Attachment[];
};

export type Result<T, E extends Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<Error> {
    return false;
  }
}

export class Failure<E extends Error> {
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is Success<unknown> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}

export type ProgramLanguage = "typescript" | "scala" | "go";
