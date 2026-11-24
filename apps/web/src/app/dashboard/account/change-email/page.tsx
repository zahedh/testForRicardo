'use client';

import {ChangeEmailScreenView} from '@smarty-app/components';
import {en} from '@smarty-app/language';

import StackRootView from '@/components/common/StackRootView';

/**
 * @returns A React element.
 */
export default function Index() {
  return (
    <StackRootView
      topBarOptions={{
        title: en.changeEmailHeader,
      }}>
      <ChangeEmailScreenView className="smarty-gap-2xl" />
    </StackRootView>
  );
}
