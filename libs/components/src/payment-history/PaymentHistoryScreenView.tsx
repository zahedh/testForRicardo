import {JSX} from 'react';
import {View, ViewProps} from 'react-native';

/**
 * Main view for PaymentHistoryScreen.
 *
 * @param props Element properties.
 * @returns JSX.Element
 */
export function PaymentHistoryScreenView(props: ViewProps): JSX.Element {
  const {testID = 'payment-history-screen-view', ...rest} = props;

  return <View testID={testID} {...rest} />;
}
