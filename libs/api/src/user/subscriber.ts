import {ApiError} from '@smarty-app/core';
import {Subscriber} from '@smarty-app/dx-api';
import {useSubscriberStore} from '@smarty-app/store';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import {useCallback} from 'react';

import {useDxApi} from '../dxApiWrapper';

export const subscriberQueryKey = ['subscriber'];
const subscriberRefetchMutationKey = ['subscriberRefetch'];

/**
 * A hook to fetch the current subscriber information.
 *
 * @returns A query result containing the subscriber information or an error.
 */
export function useSubscriberQuery(): UseQueryResult<
  Subscriber | undefined,
  ApiError
> {
  const onRequestSubscriber = useSubscriberApiFetchFn();
  const {setSubscriber} = useSubscriberStore();

  const query = useQuery<Subscriber | undefined, ApiError>({
    queryKey: subscriberQueryKey,
    queryFn: useCallback(async () => {
      const subscriber = await onRequestSubscriber();

      setSubscriber(subscriber);

      return subscriber;
    }, [onRequestSubscriber, setSubscriber]),
  });
  return query;
}

/**
 * A hook to refetch the subscriber as a one-off action, so its outcome can be
 * reacted to once like any mutation. The new subscriber data lands in the
 * subscriber query's cache as usual.
 *
 * @returns A mutation result for the refetch.
 */
export function useSubscriberRefetchMutation(): UseMutationResult<
  void,
  ApiError,
  void
> {
  const {refetch} = useSubscriberQuery();

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      const result = await refetch();
      if (result.error) {
        throw result.error;
      }
    },
    mutationKey: subscriberRefetchMutationKey,
  });
}

/**
 * A hook that returns a function to fetch the current subscriber information.
 *
 * @returns A function that, when called, fetches the subscriber information and returns it. Throws an error if the request fails.
 */
export function useSubscriberApiFetchFn(): () => Promise<Subscriber> {
  const dxApi = useDxApi();

  return useCallback(async (): Promise<Subscriber> => {
    const apiRequest = await dxApi.request<Subscriber>({
      method: 'GET',
      path: '/subscriber',
      secure: true,
      format: 'json',
    });

    return apiRequest.data;
  }, [dxApi]);
}
