export interface ResponseModel<T> {
  statusCode: number;
  data: T;
  message?: string;
  error?: string;
}
