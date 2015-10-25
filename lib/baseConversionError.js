/**
 * Created by matan on 10/22/15.
 */
class BaseConversionError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor.name)
  }
}

this.BaseConversionError = BaseConversionError;