import {PaymentHistoryScreenView} from '@smarty-app/components';
import {JSX} from 'react';

import {StackRootView} from '../../../component/common/StackRootView';

/**
 * Payment history screen.
 *
 * @returns A React element.
 */
export function PaymentHistoryScreen(): JSX.Element {
  return (
    <StackRootView testID="payment-history-screen">
      <PaymentHistoryScreenView />
    </StackRootView>
  );
}
