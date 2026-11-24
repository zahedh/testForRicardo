import {NavigationProp, useNavigation} from '@react-navigation/native';
import {usePersonalDetailsUIData} from '@smarty-app/ui-logic';
import {useCallback} from 'react';

import {HomeStackParamList} from '../../navigationTypes';

/**
 * Hook to create a callback for when the user presses "Payment History" in the You menu.
 *
 * @returns The callback.
 */
export function useOnPaymentHistoryNavigation(): () => void {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return useCallback(() => {
    navigation.navigate('PaymentHistory');
  }, [navigation]);
}

/**
 * Hook to create a callback for when the user presses "Change email" in the You menu.
 *
 * @returns The callback.
 */
export function useOnNavigateToEmailAddressEdit(): () => void {
  const personalDetailsUIData = usePersonalDetailsUIData();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return useCallback(() => {
    navigation.navigate('ChangeEmail', {
      currentEmail: personalDetailsUIData.email,
    });
  }, [personalDetailsUIData.email, navigation]);
}
