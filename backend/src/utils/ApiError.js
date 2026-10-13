export class ApiError extends Error {
  constructor(statusCode, error, message, stack = null) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    if (stack) this.stack = stack;
    else this.stack = Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      error: this.error,
      message: this.message,
      stack: this.stack ?? [],
    };
  }
}
