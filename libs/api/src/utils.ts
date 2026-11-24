import {ApiError, MILLIS_PER_MINUTE, StatusCodes} from '@smarty-app/core';
import {QueryClient} from '@tanstack/react-query';

const MAX_API_RETRIES = 2;

/**
 * React-query retry function - to be used in places where we want more granular error code checking
 * for whether the app should attempt an api retry or not based on the returned error status code.
 *
 * @param failureCount - number of times that the call has failed already.
 * @param error - error that occurred of type {@link ApiError}.
 * @returns the callback function.
 */
export const apiRetryFn = (failureCount: number, error: ApiError) => {
  if (failureCount <= MAX_API_RETRIES) {
    switch (error.status) {
      case StatusCodes.BAD_REQUEST:
      case StatusCodes.UNAUTHORIZED:
      case StatusCodes.FORBIDDEN:
      case StatusCodes.NOT_FOUND:
      case StatusCodes.METHOD_NOT_ALLOWED:
      case StatusCodes.CONFLICT:
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return false;
      default:
        return true;
    }
  }

  return false;
};

/**
 * The query client used to manage the cache.
 * Sets a staleTime of 5 minutes (when the data should be refreshed).
 * Sets a delay between retries of failed fetch attempts,
 * from 2 secs up to 10 secs max.
 */
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MILLIS_PER_MINUTE,
      retry: MAX_API_RETRIES,
      retryDelay: (failureCount: number) => {
        return Math.min(1000 * Math.pow(2, failureCount), 10000);
      },
    },
    mutations: {
      networkMode: 'online',
    },
  },
});
