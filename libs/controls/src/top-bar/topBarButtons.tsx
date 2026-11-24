import {ChevronLeft, X} from '@smarty-app/assets';
import {
  SmartyIcon,
  SmartyIconSize,
  SmartyText,
  TealGlassView,
} from '@smarty-app/controls-basic';
import {BackButtonType} from '@smarty-app/core';
import {core, TOP_BAR_ICON_SIZE} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import type {LucideIcon} from 'lucide-react-native';
import {JSX} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {isTopBarConfigModal, TopBarConfig} from './hooks/topBarCommonHooks';
import {hasBackButton} from './SmartyTopBar';

const TOP_BAR_BUTTON_RIPPLE_CONFIG = {
  color: 'rgba(0, 0, 0, 0.2)',
  borderless: false,
  foreground: true, // draws the ripple above the children (needs the bg + radius to clip)
};

// GlassView is a native component and does not support NativeWind `className`,
// so its shape (corner radius / hit area) is defined here via StyleSheet.
const topBarStyles = StyleSheet.create({
  backButtonPlaceholder: {
    width: TOP_BAR_ICON_SIZE,
    height: TOP_BAR_ICON_SIZE,
  },
  backButton: {
    width: TOP_BAR_ICON_SIZE,
    height: TOP_BAR_ICON_SIZE,
    borderRadius: TOP_BAR_ICON_SIZE / 2,
    overflow: 'visible',
  },
  trailingButton: {
    // GlassView (unlike a plain View) doesn't reliably auto-size to its
    // Pressable/Text content on iOS, so it needs an explicit height like
    // backButton has, or it can render at zero size.
    height: TOP_BAR_ICON_SIZE,
    borderRadius: 500, // large enough to make it a circle
    overflow: 'visible',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
});

/** Used on button icons and text. */
const TOP_BAR_BUTTON_FG_COLOR = core.brand.slate[800];

/**
 * A Back button rendered on the left side of SmartyTopBar.
 */
interface TopBarBackButtonProps {
  config: TopBarConfig;
  backButtonType: BackButtonType;
  hasTrailingButtons?: boolean;
  onPress?: () => void;
}

/**
 * Renders a Back button for SmartyTopBar.
 *
 * @param props - Component props.
 * @returns The button component.
 */
export function TopBarBackButton(
  props: TopBarBackButtonProps,
): JSX.Element | null {
  const {config, backButtonType, hasTrailingButtons, onPress} = props;
  const isBack = backButtonType === BackButtonType.Back;

  if (!hasBackButton(backButtonType, onPress)) {
    // No back button required, but with ContentSheet, if we have trailing buttons, we need a placeholder to maintain centered layout.
    return isTopBarConfigModal(config) && hasTrailingButtons ? (
      <View style={topBarStyles.backButtonPlaceholder} />
    ) : null;
  }

  return (
    <TealGlassView style={topBarStyles.backButton}>
      <Pressable
        className={`flex-1 items-center justify-center`}
        android_ripple={TOP_BAR_BUTTON_RIPPLE_CONFIG}
        onPress={onPress}
        testID="topBarBackButton"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isBack ? en.back : en.close}>
        <SmartyIcon
          icon={isBack ? ChevronLeft : X}
          size={SmartyIconSize.Medium}
          color={TOP_BAR_BUTTON_FG_COLOR}
        />
      </Pressable>
    </TealGlassView>
  );
}

export interface TopBarButtonIconProps {
  icon: LucideIcon;
}

/**
 * Top bar button icon at the standard size.
 *
 * Remaining SVG props are forwarded to the icon, but width and height are
 * always overridden so every marker icon renders at the same size.
 *
 * @param props - Component props
 * @param props.icon - Icon component to render
 * @returns JSX element
 */
export function TopBarButtonIcon({
  icon: Icon,
  ...svgProps
}: TopBarButtonIconProps): JSX.Element {
  return (
    <SmartyIcon
      icon={Icon}
      size={SmartyIconSize.Medium}
      color={TOP_BAR_BUTTON_FG_COLOR}
    />
  );
}

/**
 * A trailing action button rendered on the right side of SmartyTopBar.
 */
export interface TopBarButton {
  title?: string;
  icon?: React.ReactElement<TopBarButtonIconProps>;
  accessibilityLabel: string;
  testID: string;
  onPress: () => void;
}

/**
 * Renders a single glass trailing action button for SmartyTopBar.
 *
 * @param props - Component props.
 * @param props.button - The trailing button configuration to render.
 * @returns The button component.
 */
export function TopBarTrailingButton({
  button,
}: {
  button: TopBarButton;
}): JSX.Element {
  const {title, icon, onPress, testID, accessibilityLabel} = button;
  return (
    <TealGlassView
      style={
        // If we have an icon and no title, use the back button circular style. Otherwise, use the trailing button style.
        icon && !title ? topBarStyles.backButton : topBarStyles.trailingButton
      }>
      <Pressable
        className={`flex-1 items-center justify-center smarty-px-l`}
        android_ripple={TOP_BAR_BUTTON_RIPPLE_CONFIG}
        onPress={onPress}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        <View className="flex-row items-center smarty-gap-x-xs">
          {/** Allow both icon and button at the same time, or either separately. */}
          {icon ? icon : null}
          {title ? (
            <SmartyText
              className={`smarty-cta-s text-brand-slate-800`}
              maxFontSizeMultiplier={1.2}>
              {title}
            </SmartyText>
          ) : null}
        </View>
      </Pressable>
    </TealGlassView>
  );
}

/**
 * Props for {@link TopBarTrailingButtons}.
 */
export interface TopBarTrailingButtonsProps {
  config: TopBarConfig;
  trailingPrimaryButton: TopBarButton | undefined;
  trailingSecondaryButton: TopBarButton | undefined;
  /** Whether the top bar has a back button. */
  hasBack: boolean;
  /** Component to wrap the buttons in, rendered with the buttons container style.  Default is View. */
  container?: React.ComponentType<{
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }>;
}

/**
 * Renders the trailing secondary/primary buttons, or an invisible spacer in
 * place of a missing primary button on ContentSheet so the title stays centered.
 *
 * @param props - Component props.
 * @returns The rendered trailing buttons.
 */
export function TopBarTrailingButtons(
  props: TopBarTrailingButtonsProps,
): JSX.Element | null {
  const {
    config,
    trailingPrimaryButton,
    trailingSecondaryButton,
    hasBack,
    container: Container = View,
  } = props;

  if (!trailingPrimaryButton && !trailingSecondaryButton) {
    // No trailing buttons required, but with ContentSheet, if we have Back, we need a placeholder to maintain centered layout.
    return isTopBarConfigModal(config) && hasBack ? (
      <View style={topBarStyles.backButtonPlaceholder} />
    ) : null;
  }

  return (
    // Docks to the right on its own, since the title isn't always in the row to push against (e.g. when stacked).
    <Container style={topBarStyles.buttonsContainer}>
      {trailingSecondaryButton && (
        <TopBarTrailingButton button={trailingSecondaryButton} />
      )}
      {trailingPrimaryButton && (
        <TopBarTrailingButton button={trailingPrimaryButton} />
      )}
    </Container>
  );
}
