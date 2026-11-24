import {SmartyText} from '@smarty-app/controls-basic';
import clsx from 'clsx';
import {JSX, Ref} from 'react';
import {AccessibilityProps, Text, View} from 'react-native';

import {MODAL_TITLE_ID} from '../content-sheet/hooks/contentSheetHooks';
import {isTopBarConfigModal, TopBarConfig} from './hooks/topBarCommonHooks';

/**
 * Props for a TopBarTitle (part of a SmartyTopBar).
 */
export interface TopBarTitleProps {
  config: TopBarConfig;
  title?: string;
  subtitle?: string;
  titleSmall?: boolean;
  titleRef?: Ref<Text>;
}

/**
 * Renders the title and subtitle for a SmartyTopBar.
 *
 * @param props - Component props.
 * @returns The title component.
 */
export function TopBarTitle(props: TopBarTitleProps): JSX.Element {
  const {config, title, subtitle, titleSmall = false, titleRef} = props;
  const titleClassName = `font-theme-bold text-foreground-accent`;
  const subtitleClassName = `smarty-caption-l text-foreground-primary`;
  const titleGap = titleSmall ? 'smarty-gap-s' : 'smarty-gap-m';
  const titleMaxMultiplier = titleSmall ? 1.2 : 1;
  const subtitleMaxMultiplier = 1.2;
  // Only attach the ref when there's a title, as an empty title isn't accessible and can't take focus.
  const accessibleTitleRef = title ? titleRef : undefined;
  const titleAccessibilityProps: AccessibilityProps = {
    accessible: !!title,
    accessibilityRole: title ? 'header' : undefined,
  };

  return isTopBarConfigModal(config) ? (
    <View className={clsx('flex-1 items-center', titleGap)}>
      <SmartyText
        {...titleAccessibilityProps}
        ref={accessibleTitleRef}
        nativeID={MODAL_TITLE_ID}
        accessible={!!title}
        className={clsx(titleClassName, 'smarty-body-l text-center')}
        maxFontSizeMultiplier={titleMaxMultiplier}>
        {title}
      </SmartyText>
      {subtitle ? (
        <SmartyText
          className={clsx(subtitleClassName, 'text-center')}
          maxFontSizeMultiplier={subtitleMaxMultiplier}>
          {subtitle}
        </SmartyText>
      ) : null}
    </View>
  ) : (
    <View className={clsx('flex-1', titleGap)}>
      <SmartyText
        {...titleAccessibilityProps}
        ref={accessibleTitleRef}
        className={clsx(
          titleClassName,
          titleSmall ? 'smarty-body-l' : 'smarty-heading-s',
        )}
        maxFontSizeMultiplier={titleMaxMultiplier}>
        {title}
      </SmartyText>
      {subtitle ? (
        <SmartyText
          className={subtitleClassName}
          maxFontSizeMultiplier={subtitleMaxMultiplier}>
          {subtitle}
        </SmartyText>
      ) : null}
    </View>
  );
}
