import {ChangeEmailScreenView} from '@smarty-app/components';
import {JSX} from 'react';

import {StackRootView} from '../../../component/common/StackRootView';

/**
 * Change email screen.
 *
 * @returns A React element.
 */
export function ChangeEmailScreen(): JSX.Element {
  return (
    <StackRootView testID="change-email-screen">
      <ChangeEmailScreenView />
    </StackRootView>
  );
}
