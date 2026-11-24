import {useEditUserEmail, useGetUserDetails} from '@smarty-app/api-controller';
import {useSmartyDialog} from '@smarty-app/controls';
import {ApiInteractionHandler} from '@smarty-app/core';
import {en} from '@smarty-app/language';
import {validateChangeEmail} from '@smarty-app/ui-logic';
import {useOnBackNavigation} from '@smarty-app/ui-navigation';
import {ApiErrorStateStore, useApiErrorStateStore} from '@smarty-app/ui-state';
import {useCallback, useEffect} from 'react';

/**
 * Hook to manage change email form state and submission.
 *
 * @returns Change email state, validation, and submit handlers.
 */
export function useChangeEmailApiInteraction(): ApiInteractionHandler<string> {
  const {data} = useGetUserDetails();

  const {showAlertDialog} = useSmartyDialog();
  const navigateBack = useOnBackNavigation();

  const {reset: resetApiErrorState, setErrorText} = useApiErrorStateStore(
    (state: ApiErrorStateStore) => ({
      reset: state.reset,
      setErrorText: state.setErrorText,
    }),
    true,
  );

  const {
    result: {isSuccess, isUpdating, isError},
    invoke,
  } = useEditUserEmail();

  useEffect(() => {
    if (isSuccess) {
      navigateBack();
      showAlertDialog(en.confirmText1, en.confirmText2, [
        {
          text: en.ok,
        },
      ]);
    }
  }, [isSuccess, showAlertDialog, navigateBack]);

  useEffect(() => {
    if (isError) {
      setErrorText(en.confirmErrorText3);
    }
  }, [isError, setErrorText]);

  const handleSubmit = useCallback(
    (newEmail: string) => {
      resetApiErrorState();
      const {isEmailValid} = validateChangeEmail(newEmail, data?.email);

      if (isEmailValid) {
        invoke(newEmail);
      }
    },
    [invoke, data, resetApiErrorState],
  );

  return {
    onInvokeApi: (newEmail: string) => handleSubmit(newEmail),
    isApiUpdating: isUpdating,
    isApiSuccess: isSuccess,
  };
}
