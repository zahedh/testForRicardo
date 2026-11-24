import {Check} from '@smarty-app/assets';
import {
  cn,
  SmartyContentCard,
  SmartyPrimaryButton,
  SmartyScrollView,
  SmartyText,
} from '@smarty-app/controls-basic';
import {BackButtonType} from '@smarty-app/core';
import {en} from '@smarty-app/language';
import {MODAL_BACKGROUND_SEMANTIC_COLOR} from '@smarty-app/util-generic';
import {JSX, useEffect} from 'react';
import {Platform, Text, View} from 'react-native';

import {useAccessibilityFocus} from '../accessibility/accessibilityFocusHooks';
import {
  MODAL_MARGIN_BOTTOM_DEFAULT,
  MODAL_MARGIN_HORIZONTAL_DEFAULT,
} from '../content-sheet/hooks/contentSheetHooks';
import {TopBarConfig} from '../top-bar/hooks/topBarCommonHooks';
import {SmartyTopBar} from '../top-bar/SmartyTopBar';
import {TopBarButtonIcon} from '../top-bar/topBarButtons';
import {
  SmartyAlertDialogProps,
  SmartyDialogProps,
} from './hooks/smartyDialogHooks';

/**
 * A basic React Native dialog rendered using Smarty UI components.
 * Note: Dialog role and accessibility attributes should be set by the parent provider.
 *
 * @param props Element props.
 * @returns The dialog component.
 */
export function SmartyDialog(props: SmartyDialogProps): JSX.Element {
  const {
    testID = 'dialog',
    title,
    subtitle,
    content,
    onDismiss,
    closeButtonType,
    onClosePress,
    onOkayPress,
    addContentPadding = true,
  } = props;
  const {ref: titleRef, focus: focusTitle} = useAccessibilityFocus<Text>();

  // On mobile, move screen reader focus to the title when the dialog opens, so it isn't left on the screen behind.
  // The web provider moves focus to the dialog itself.
  useEffect(() => {
    if (title) {
      focusTitle();
    }
  }, [title, focusTitle]);

  return (
    <SmartyContentCard
      testID={testID}
      className={cn(
        `${MODAL_BACKGROUND_SEMANTIC_COLOR} p-0`,
        // Max dialog height as a percentage of screen height.
        // On web, the shadow goes on the card itself, because a web box-shadow isn't clipped by the element's own
        // overflow-hidden ("shadow-modal" is MODAL_BOX_SHADOW).  Web dialogs also use a larger radius, replacing the
        // card's default "smarty-rounded-xl".  On native, the provider's wrapper carries the shadow, and the card fills it.
        Platform.OS === 'web'
          ? 'max-h-[70vh] shadow-modal smarty-rounded-2xl'
          : 'max-h-[80vh] w-full',
      )}>
      <SmartyScrollView
        // flex-shrink lets this shrink before the card's max-height clips it, so it scrolls instead of overflowing.
        className="flex-shrink"
        // The top bar is a sticky header, so it takes its real height in the layout, while the content still
        // scrolls beneath its translucent scrim.
        stickyHeaderIndices={[0]}>
        <SmartyTopBar
          config={TopBarConfig.Dialog}
          title={title}
          titleRef={titleRef}
          subtitle={subtitle}
          goBack={() => {
            onDismiss?.();
            onClosePress?.();
          }}
          // If closeButtonType isn't defined, default to BackButtonType.Close.
          backButtonType={closeButtonType ?? BackButtonType.Close}
          {...(onOkayPress && {
            trailingPrimaryButton: {
              icon: <TopBarButtonIcon icon={Check} />,
              accessibilityLabel: en.okay,
              testID: 'top-bar-trailing-okay-button',
              onPress: () => {
                onDismiss?.();
                onOkayPress?.();
              },
            },
          })}
        />
        <View
          className={
            addContentPadding
              ? `${MODAL_MARGIN_HORIZONTAL_DEFAULT} ${MODAL_MARGIN_BOTTOM_DEFAULT}`
              : undefined
          }>
          {content}
        </View>
      </SmartyScrollView>
    </SmartyContentCard>
  );
}

/**
 * Creates content for a React Native "Alert"-style {@link SmartyDialog}.
 * This is used on web, and optionally on mobile.
 *
 * @param props Element props.
 * @returns The dialog content component.
 */
export function SmartyAlertDialogContent(
  props: SmartyAlertDialogProps,
): JSX.Element {
  const {message, buttons} = props;
  return (
    <View className={'w-full'}>
      <SmartyText className="smarty-body-l smarty-mb-l">{message}</SmartyText>

      <View className="flex-row w-full smarty-gap-x-m">
        {buttons?.map((button, index) => (
          <SmartyPrimaryButton
            key={index}
            className="flex-1"
            onPress={() => {
              button.onPress?.();
            }}>
            {button.text}
          </SmartyPrimaryButton>
        ))}
      </View>
    </View>
  );
}
