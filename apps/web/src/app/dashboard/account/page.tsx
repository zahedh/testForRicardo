'use client';

import {YouMainMenuItems} from '@smarty-app/components';
import {BackButtonType} from '@smarty-app/core';
import {en} from '@smarty-app/language';
import {View} from 'react-native';

import StackRootView from '@/components/common/StackRootView';

/**
 * @returns A React element.
 */
export default function Index() {
  return (
    <StackRootView
      topBarOptions={{
        title: en.accountMenuHeader,
        titleSmall: false,
        backButtonType: BackButtonType.None,
      }}>
      <View className="flex flex-col smarty-gap-2xl">
        <YouMainMenuItems />
      </View>
    </StackRootView>
  );
}
