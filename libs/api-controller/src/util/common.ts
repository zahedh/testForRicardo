import {ApiCall, ApiError, ApiFetch, ApiResult} from '@smarty-app/core';
import {UseMutationResult, UseQueryResult} from '@tanstack/react-query';

/**
 * Maps react-query UseQueryResult into domain {@link ApiFetch} result.
 *
 * @param queryResult - react-query result.
 * @returns a {@link ApiFetch} result.
 */
export function mapQueryResultToFetchResult<TData, TResult>(
  queryResult: UseQueryResult<TData, ApiError>,
): ApiFetch<TResult> {
  return {
    result: {
      isSuccess: queryResult.isSuccess,
      isError: queryResult.isError,
      isUpdating: queryResult.isFetching,
      error: queryResult.error,
    },
    refetch: queryResult.refetch,
  };
}

/**
 * Maps react-query UseMutationResult into domain {@link ApiCall} result.
 *
 * @param queryResult - react-query result.
 * @returns a {@link ApiCall} result.
 */
export function mapMutationResultToApiResult<TData, TRequest>(
  queryResult: UseMutationResult<TData, ApiError, TRequest>,
): ApiResult {
  return {
    isSuccess: queryResult.isSuccess,
    isError: queryResult.isError,
    isUpdating: queryResult.isPending,
    error: queryResult.error,
  };
}
