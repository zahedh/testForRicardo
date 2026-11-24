import {BackButtonType} from '@smarty-app/core';
import {semantic, ThemeColorVariants} from '@smarty-app/design-tokens';
import {getColorForModalBackground} from '@smarty-app/util-generic';
import clsx from 'clsx';
import {JSX, Ref} from 'react';
import {Platform, Text, View} from 'react-native';

import {MODAL_MARGIN_HORIZONTAL_DEFAULT} from '../content-sheet/hooks/contentSheetHooks';
import {isTopBarConfigModal, TopBarConfig} from './hooks/topBarCommonHooks';
import {useTopBarPlatformConfig} from './hooks/topBarHooks';
import {TopBarBackdrop} from './TopBarBackdrop';
import {
  TopBarBackButton,
  TopBarButton,
  TopBarTrailingButtons,
} from './topBarButtons';
import {TopBarTitle} from './TopBarTitle';

/**
 * Navigation options understood by SmartyTopBar: an optional title, subtitle
 * and trailing buttons, which can be set statically in the navigator or
 * dynamically from a screen.
 */
export type SmartyTopBarOptions = {
  title?: string;
  config?: TopBarConfig;
  backButtonType?: BackButtonType;
  /** Back navigation callback.  Utils such as smartyTopBarOptions on mobile and StackRootView on web may inject default back navigation if available (unless backButtonType is None). */
  goBack?: () => void;
  subtitle?: string;
  trailingPrimaryButton?: TopBarButton;
  trailingSecondaryButton?: TopBarButton;
  /** If true, the title will be rendered with a smaller font.  Default is false. */
  titleSmall?: boolean;
  /** If true, the bar has no blur or scrim, so content behind it (such as a header image) is shown untouched.  Default is false. */
  transparentBackdrop?: boolean;
  /** Ref to the title text, for example to move screen reader focus to it. */
  titleRef?: Ref<Text>;
};

/**
 * Reusable top app bar with a teal-tinted glass back button, a centered title
 * with an optional subtitle, and a optional glass primary and secondary buttons on the right.
 *
 * @param options Component options.
 * @returns The component.
 */
export function SmartyTopBar(options: SmartyTopBarOptions): JSX.Element {
  const {
    config = TopBarConfig.Screen,
    backButtonType = BackButtonType.Back,
    goBack,
    title,
    subtitle,
    trailingPrimaryButton,
    trailingSecondaryButton,
    titleSmall = true,
    transparentBackdrop = false,
    titleRef,
  } = options;
  // On sheets, title is stacked below buttons.
  const stacked = config === TopBarConfig.ScreenStacked;

  const hasBack = hasBackButton(backButtonType, goBack);
  const hasTrailing = !!trailingPrimaryButton || !!trailingSecondaryButton;
  const isModal = isTopBarConfigModal(config);
  const showBack = hasBack || (isModal && hasTrailing);
  const showTrailing = hasTrailing || (isModal && hasBack);

  const bottomPaddingClassName = isModal ? 'smarty-pb-l' : 'smarty-pb-xl';
  const {topPadding, addHorizontalPadding, buttonsContainer} =
    useTopBarPlatformConfig(config);
  const horizontalPaddingClassName = addHorizontalPadding
    ? isModal
      ? MODAL_MARGIN_HORIZONTAL_DEFAULT
      : 'smarty-px-l'
    : undefined;

  const backButton = (
    <TopBarBackButton
      config={config}
      backButtonType={backButtonType}
      onPress={goBack}
      hasTrailingButtons={hasTrailing}
    />
  );
  const titleElement = (
    <TopBarTitle
      config={config}
      title={title}
      subtitle={subtitle}
      titleSmall={titleSmall}
      titleRef={titleRef}
    />
  );
  const trailingButtons = (
    <TopBarTrailingButtons
      config={config}
      trailingPrimaryButton={trailingPrimaryButton}
      trailingSecondaryButton={trailingSecondaryButton}
      hasBack={hasBack}
      container={buttonsContainer}
    />
  );

  return (
    <View className={bottomPaddingClassName} style={{paddingTop: topPadding}}>
      <TopBarBackdrop
        config={config}
        transparent={transparentBackdrop}
        backgroundColor={
          isTopBarConfigModal(config)
            ? getColorForModalBackground()
            : semantic.background.tertiary // Screen background.
        }
      />

      <View
        className={clsx(
          `flex-row items-center smarty-gap-xl`,
          horizontalPaddingClassName,
        )}>
        {showBack && backButton}

        {/* When not stacked, title appears in line with the buttons. */}
        {!stacked && titleElement}

        {showTrailing && trailingButtons}
      </View>

      {/* When stacked, title appears below the buttons. */}
      {stacked ? (
        <View className={clsx('smarty-mt-xl', horizontalPaddingClassName)}>
          {titleElement}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Determines whether a back button should be displayed based on the back button type and the presence of a goBack callback.
 *
 * @param backButtonType - The type of the back button.
 * @param goBack - The callback function for back navigation.
 * @returns True if a back button should be displayed, false otherwise.
 */
export function hasBackButton(
  backButtonType: BackButtonType | undefined,
  goBack?: () => void,
) {
  return backButtonType !== BackButtonType.None && !!goBack;
}

/**
 * Returns a test ID for a top bar scrim based on the configuration.
 *
 * @param config - The config the bar is rendered in.
 * @returns The scrim ID as a string.
 */
export function getTopBarScrimTestID(config?: TopBarConfig): string {
  return `top-bar-scrim${config && isTopBarConfigModal(config) ? '-modal' : '-screen'}`;
}

export interface TopBarBackdropProps {
  /**
   * The config of the top bar the backdrop is associated with.
   * If undefined, it's assumed to be standalone, and not part of a SmartyTopBar.
   */
  config?: TopBarConfig;
  backgroundColor: ThemeColorVariants;
  transparent?: boolean;
}

// The bar sits on top of the screen content, so instead of a solid fill it is
// backed by a scrim that fades the screen background out from the very top of
// the screen down to the bottom edge of the bar. On iOS the blur behind the bar
// does most of the separating, so the scrim there only has to tint and to
// feather the bottom edge; on Android and web there is no blur, so the scrim is
// the whole effect and has to hide the content behind the bar's controls on its
// own.
export const SCRIM_ALPHA_STOPS =
  Platform.OS === 'ios' ? [0.7, 0.55, 0.35, 0.14, 0] : [1, 0.98, 0.88, 0.5, 0];
export const SCRIM_LOCATIONS = [0, 0.45, 0.7, 0.88, 1] as const;
