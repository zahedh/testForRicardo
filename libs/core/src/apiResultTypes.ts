export const API_ERROR_MESSAGE = 'API Error';

export class ApiError<TMetaData = undefined> extends Error {
  status: number;
  errorResponse: ErrorDetail[] | undefined;
  metaData?: TMetaData;
  /**
   *
   * @param status - HTTP status code.
   * @param errorResponse - The error response from the API.
   * @param metaData - Any possible meta data included in the error message of generic type.
   * @param params - Other parameters you pass to `new Error` (this varies
   * depending on the environment, but is at least a message string).
   */
  constructor(
    status: number,
    errorResponse: ErrorDetail[] | undefined,
    metaData?: TMetaData,
    ...params: ConstructorParameters<ErrorConstructor>
  ) {
    super(...params);

    this.status = status;
    this.errorResponse = errorResponse;
    this.metaData = metaData;
  }

  /**
   * Convert the error to a string.
   *
   * @returns A string containing the status code.
   */
  override toString(): string {
    return `${this.status}: ${this.message}}`;
  }

  /**
   * Provides the first/only error message provided from the API.
   *
   * @returns A single ErrorDetail containing the first/only error message.
   */
  firstMessage(): ErrorDetail | undefined {
    if (this.errorResponse && this.errorResponse?.length > 0) {
      return this.errorResponse[0];
    }
    return undefined;
  }
}

interface ErrorResponse1 {
  detail: {
    type: string;
    message: string;
  };
  source: {
    pointer: string;
  };
}

interface ErrorResponse2 {
  detail: string;
  source: {
    pointer: string;
  };
}

export type ApiErrorResponse = ErrorResponse1 | ErrorResponse2;

export interface ApiErrorDto<TMetaData> {
  httpStatus?: number;
  errors: Array<ApiErrorResponse>;
  meta?: TMetaData;
}

export interface ErrorDetail {
  message: string;
  sourcePointer: string;
}

export interface ApiSuccessResponseDto<T> {
  status: number;
  dto: T;
}

export interface ApiResult {
  isSuccess: boolean;
  isUpdating: boolean;
  isError: boolean;
  error?: ApiError | null;
}

export interface RefetchApiResult {
  isSuccess: boolean;
  isError: boolean;
  error?: ApiError | null;
}

export interface ApiFetch<T> {
  data?: T;
  result: ApiResult;
  refetch?: () => void;
  refetchResult?: RefetchApiResult;
  reset?: () => void;
}

export interface ApiCall<TRequest, TResult> {
  data?: TResult;
  result: ApiResult;
  invoke: (request: TRequest) => void;
}
