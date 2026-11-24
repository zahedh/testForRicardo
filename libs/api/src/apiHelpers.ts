import {
  API_ERROR_MESSAGE,
  ApiError,
  ApiErrorDto,
  ApiErrorResponse,
  ErrorDetail,
} from '@smarty-app/core';

export type Environment = {
  timeout: number;
};

type FetchInput = Parameters<typeof fetch>[0];
type FetchOptions = Parameters<typeof fetch>[1];

let env: Environment = {} as Environment; // intentionally designed to fail

/**
 * @returns The current {@link Environment}.
 */
export function getApiEnv(): Environment {
  return env;
}

/**
 * Set the environment.
 *
 * @param environment - The {@link Environment} to use.
 */
export function setApiLibEnv(environment: Environment): void {
  env = environment;
}

/**
 * Convert a `Response` from the `fetch` function to
 * an {@link ApiError}.
 *
 * @param response - The `Response` from `fetch`.
 * @returns A promise that resolves to a hopefully useful {@link ApiError}.
 */
export async function errorFromResponse<TMetaData>(
  response: Response,
): Promise<ApiError<TMetaData>> {
  try {
    const contentType = response.headers.get('content-type');

    if ((contentType?.indexOf('application/json') ?? -1) !== -1) {
      const responseJson = await response.json();
      const json = responseJson as ApiErrorDto<TMetaData>;

      const errors: Array<ErrorDetail> = json.errors.map(
        (error: ApiErrorResponse) => {
          return {
            message:
              typeof error.detail === 'string'
                ? error.detail
                : error.detail.message,
            sourcePointer: error.source.pointer,
          };
        },
      );

      return new ApiError<TMetaData>(response.status, errors, json.meta);
    }
  } catch {
    // ignore
  }

  return new ApiError<TMetaData>(
    response.status,
    undefined,
    undefined,
    `${response.statusText || API_ERROR_MESSAGE}`,
  );
}

/**
 * Wrap `fetch()` with an AbortController, since React Native doesn't support
 * AbortSignal.timeout yet.
 *
 * @param info - First parameter to `fetch`.
 * @param init - Second parameter to `fetch`.
 * @returns The return value of `fetch`.
 */
export async function fetchWithTimeout(
  info: FetchInput,
  init?: FetchOptions,
): Promise<Response> {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, getApiEnv().timeout);

  try {
    const response = await fetch(info, {...init, signal: controller.signal});
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}
