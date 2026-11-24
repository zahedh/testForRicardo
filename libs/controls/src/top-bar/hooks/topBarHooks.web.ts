import {View} from 'react-native';

import {
  isTopBarConfigModal,
  SmartyTopBarPlatformConfig,
  TopBarConfig,
} from './topBarCommonHooks';

/**
 * A hook to get the inset for the top bar, not used on web.
 *
 * @returns The header height in points, or 0 when there is no header.
 */
export function useTopBarInset(): number {
  return 0;
}

/**
 * Platform-specific configuration for top bar.
 *
 * @param config - The config the bar is rendered in.
 * @returns The platform-specific configuration.
 */
export function useTopBarPlatformConfig(
  config: TopBarConfig,
): SmartyTopBarPlatformConfig {
  const isModal = isTopBarConfigModal(config);

  return {
    topPadding: isModal ? 24 : 16, // 'smarty-pt-xl' for modals, 'smarty-pt-l' for screens.
    addHorizontalPadding: isModal, // Screens don't require horizontal padding as we have a gutter.
    buttonsContainer: View,
  };
}
