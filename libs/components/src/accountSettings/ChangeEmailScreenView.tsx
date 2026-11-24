import {useGetUserDetails} from '@smarty-app/api-controller';
import {SmartyEmailInput} from '@smarty-app/controls';
import {cn, SmartyPrimaryButton, SmartyText} from '@smarty-app/controls-basic';
import {en} from '@smarty-app/language';
import {useChangeEmailApiInteraction} from '@smarty-app/ui-api-interaction';
import {validateChangeEmail} from '@smarty-app/ui-logic';
import {ApiErrorStateStore, useApiErrorStateStore} from '@smarty-app/ui-state';
import {JSX, useCallback, useMemo, useState} from 'react';
import {View, ViewProps} from 'react-native';

import {SmartyRootScreenView} from '../common/SmartyRootScreenView';

/**
 * Shared change email screen view component.
 *
 * @param props - The props for the component, extending ViewProps.
 * @returns A React element.
 */
export function ChangeEmailScreenView(props: ViewProps): JSX.Element {
  const {className} = props;
  const {data} = useGetUserDetails();

  const [newEmail, setNewEmail] = useState<string>('');

  const {reset: resetApiErrorState} = useApiErrorStateStore(
    (state: ApiErrorStateStore) => ({
      reset: state.reset,
    }),
    true,
  );

  const {isApiUpdating, onInvokeApi: submitEmailChange} =
    useChangeEmailApiInteraction();

  const {isEmailValid, showInvalidEmail, showSameEmail} = validateChangeEmail(
    newEmail,
    data?.email,
  );

  const onChangeText = useCallback(
    (text: string) => {
      resetApiErrorState();
      setNewEmail(text);
    },
    [resetApiErrorState],
  );

  const errorText = useMemo(() => {
    if (showInvalidEmail) {
      return en.invalidEmail;
    }
    if (showSameEmail) {
      return en.sameEmail;
    }
    return undefined;
  }, [showInvalidEmail, showSameEmail]);

  return (
    <SmartyRootScreenView
      testID="change-email-screen"
      className={cn(`flex-1 justify-between`, className)}>
      <View className="smarty-gap-l">
        <SmartyText className="smarty-heading-xs text-foreground-primary">
          {en.changeEmailTitle}
        </SmartyText>
        <SmartyEmailInput
          testID="change-email-input"
          value={newEmail}
          onChangeText={onChangeText}
          title={en.changeEmail}
          error={errorText}
          accessible={true}
          accessibilityLabel={en.changeEmail}
        />
      </View>
      <SmartyPrimaryButton
        onPress={() => submitEmailChange(newEmail)}
        disabled={!isEmailValid}
        isLoading={isApiUpdating}
        accessible={true}
        accessibilityLabel={en.saveChanges}>
        {en.saveChanges}
      </SmartyPrimaryButton>
    </SmartyRootScreenView>
  );
}
