import {ApiError} from '@smarty-app/core';
import {ContentType, EditSubscriber} from '@smarty-app/dx-api';
import {
  useIsMutating,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

import {useDxApi} from '../dxApiWrapper';
import {subscriberQueryKey} from './subscriber';

const editSubscriberMutationKey = ['editSubscriber'];

/**
 * A hook to update the current subscriber information using a PUT request.
 *
 * The mutation stays pending until the subscriber has been fetched again, so
 * nothing shows the old details between the save and the refetch.
 *
 * @returns A mutation result for updating subscriber information.
 */
export function useSubscriberEditMutation(): UseMutationResult<
  void,
  ApiError,
  EditSubscriber
> {
  const onEditSubscriber = useSubscriberEditApiFn();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onEditSubscriber,
    mutationKey: editSubscriberMutationKey,
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: subscriberQueryKey}),
  });
}

/**
 * A hook to know whether a subscriber edit is in flight, from any component,
 * not only the one that started it.
 *
 * @returns True while at least one subscriber edit mutation is running.
 */
export function useIsSubscriberEditMutating(): boolean {
  return useIsMutating({mutationKey: editSubscriberMutationKey}) > 0;
}

/**
 * A hook that returns a function to update the subscriber information via a PUT request.
 *
 * @returns A function that, when called, updates the subscriber information. Throws an error if the request fails.
 */
export function useSubscriberEditApiFn(): (
  editSubscriber: EditSubscriber,
) => Promise<void> {
  const dxApi = useDxApi();

  return async (editSubscriber: EditSubscriber): Promise<void> => {
    await dxApi.request({
      method: 'PUT',
      path: '/subscriber',
      secure: true,
      type: ContentType.Json,
      body: editSubscriber,
    });
  };
}
