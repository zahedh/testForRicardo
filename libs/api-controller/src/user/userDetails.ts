import {useIsSubscriberEditMutating, useSubscriberQuery} from '@smarty-app/api';
import {ApiFetch, mapSubscriberDtoToUser, User} from '@smarty-app/core';
import {useSubscriberStore} from '@smarty-app/store';
import {useMemo} from 'react';

import {mapQueryResultToFetchResult} from '../util/common';

/**
 * A hook to fetch user details. It uses the subscriber query to get the subscriber information and maps it to a User model.
 * If the subscriber information is not available from the query, it falls back to using the subscriber data from the store.
 *
 * @returns An ApiFetch result containing the User details or an error.
 */
export function useGetUserDetails(): ApiFetch<User> {
  const query = useSubscriberQuery();
  const {subscriber: subscriberStoreData} = useSubscriberStore();

  const userDetails = useMemo(() => {
    if (query.data) {
      return mapSubscriberDtoToUser(query.data);
    }
    if (subscriberStoreData) {
      return mapSubscriberDtoToUser(subscriberStoreData);
    }
    return undefined;
  }, [query.data, subscriberStoreData]);

  return {
    ...mapQueryResultToFetchResult(query),
    data: userDetails,
  };
}

/**
 * Hook to know whether any update to the user's details is in flight, such as
 * a change of email, address or marketing preferences.
 *
 * @returns True while an update is running.
 */
export function useIsUpdatingUserDetails(): boolean {
  return useIsSubscriberEditMutating();
}
