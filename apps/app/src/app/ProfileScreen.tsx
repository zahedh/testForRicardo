import {YouMainMenuItems} from '@smarty-app/components';
import {SmartyTopBar} from '@smarty-app/controls';
import {SmartyScrollView} from '@smarty-app/controls-basic';
import {BackButtonType} from '@smarty-app/core';
import {en} from '@smarty-app/language';
import {View} from 'react-native';

import {StackRootView} from './component/common/StackRootView';
import {useTabScreenBottomSpacing} from './hooks/tabScreenBottomSpacingHooks';

/**
 * The profile tab.
 *
 * @returns A React element.
 */
export function ProfileScreen() {
  const bottomSpacing = useTabScreenBottomSpacing();

  return (
    <StackRootView className="flex-1" addSafeBottom={false}>
      <SmartyScrollView contentContainerClassName="smarty-pb-l">
        <SmartyTopBar
          title={en.accountMenuHeader}
          titleSmall={false}
          backButtonType={BackButtonType.None}
        />
        <View
          className="flex-1 smarty-rounded-t-2xl bg-background-primary smarty-pt-l"
          style={{paddingBottom: bottomSpacing}}>
          <View className="smarty-mx-m smarty-gap-2xl">
            <YouMainMenuItems />
          </View>
        </View>
      </SmartyScrollView>
    </StackRootView>
  );
}
