export default interface UnifiedResponse<T> {
  /**
   * business status code
   */
  errorCode: number;
  message?: string;
  /**
   * Response data
   */
  data?: T;
}
