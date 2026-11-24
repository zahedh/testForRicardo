import type {StyleProp, ViewStyle} from 'react-native';

export enum TopBarConfig {
  Screen = 'screen',
  /** Used on screens where we want the title and subtitle to appear stacked beneath the Back button. */
  ScreenStacked = 'screenStacked',
  Dialog = 'dialog',
  BottomSheet = 'bottomSheet',
}

/**
 * SmartyTopBar platform-specific config values.
 */
export interface SmartyTopBarPlatformConfig {
  topPadding: number;
  addHorizontalPadding: boolean;
  /** Component to wrap the buttons in, rendered with the buttons container style.  Default is View. */
  buttonsContainer?: React.ComponentType<{
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }>;
}

/**
 * Determines if the specified top bar config represents a modal (i.e. a dialog or bottom sheet).
 *
 * @param config - The top bar config to check.
 * @returns True if the config is for a modal, false otherwise.
 */
export function isTopBarConfigModal(config: TopBarConfig | undefined): boolean {
  return config === TopBarConfig.Dialog || config === TopBarConfig.BottomSheet;
}
