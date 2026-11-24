import {useSubscriberEditMutation} from '@smarty-app/api';
import {ApiCall} from '@smarty-app/core';
import {useEffect} from 'react';

import {mapMutationResultToApiResult} from '../util/common';

/**
 * Hook to update the user's email address.
 *
 * @returns An ApiCall result for updating the user's email address.
 */
export function useEditUserEmail(): ApiCall<string, void> {
  const mutation = useSubscriberEditMutation();

  useEffect(() => {
    if (mutation.isError || mutation.isSuccess) {
      mutation.reset();
    }
  }, [mutation]);

  return {
    result: mapMutationResultToApiResult(mutation),
    invoke: (newEmail: string) => mutation.mutate({email: newEmail}),
  };
}
