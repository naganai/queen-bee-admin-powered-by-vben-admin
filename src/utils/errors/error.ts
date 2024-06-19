export class RequestError extends Error {
  statusCode: number;
  errorCode: number;
  override message: string;

  /**
   * @param statusCode http status code
   * @param errorCode business status code
   * @param message error message
   */
  constructor(statusCode: number, errorCode: number, message: string = '') {
    super(message);
    this.name = 'RequestError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.message = message;
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  // override toString method
  override toString(): string {
    return `RequestError: ${this.message} (statusCode: ${this.statusCode}, errorCode: ${this.errorCode})`;
  }
}
