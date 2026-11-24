import {HeaderHeightContext} from '@react-navigation/elements';
import {GlassContainer} from 'expo-glass-effect';
import {useContext} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  isTopBarConfigModal,
  SmartyTopBarPlatformConfig,
  TopBarConfig,
} from './topBarCommonHooks';

/** Height of a bottom sheet's drag handle row (handle plus its margins). */
const DRAG_HANDLE_ROW_HEIGHT = 24;

/**
 * Height of the header floating above the current screen.
 *
 * The SmartyAppBar is translucent and therefore rendered on top of the
 * screen content, so screens have to inset their own content by this much to
 * stay clear of it.
 *
 * @returns The header height in points, or 0 when there is no header.
 */
export function useTopBarInset(): number {
  return useContext(HeaderHeightContext) ?? 0;
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
  const insets = useSafeAreaInsets();
  // Padding above SmartyTopBar, normally equivalent to 'smarty-pt-l'.
  // For bottom sheets it's slightly larger, as DRAG_HANDLE_ROW_HEIGHT is equivalent to 'smarty-pt-xl'.
  const topPadding =
    config === TopBarConfig.BottomSheet ? DRAG_HANDLE_ROW_HEIGHT : 16;

  return {
    // Screens add top inset, modals don't.
    topPadding: topPadding + (isTopBarConfigModal(config) ? 0 : insets.top),
    addHorizontalPadding: true,
    buttonsContainer: GlassContainer,
  };
}
