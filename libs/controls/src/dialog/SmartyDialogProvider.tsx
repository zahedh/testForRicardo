import {MODAL_BOX_SHADOW} from '@smarty-app/design-tokens';
import {useColorForModalOverlay} from '@smarty-app/util-generic';
import {ReactNode, useCallback, useEffect, useMemo} from 'react';
import {
  Alert,
  AlertButton,
  AlertOptions,
  BackHandler,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';

import {
  MODAL_DISMISS_ON_BACK_DEFAULT,
  MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT,
} from '../content-sheet/hooks/contentSheetHooks';
import {
  createAlertDialogButtons,
  SmartyDialogContext,
  useSmartyDialogState,
} from './hooks/smartyDialogHooks';
import {SmartyDialog} from './SmartyDialog';

/**
 * Drop shadow lifting the dialog off the dimmed backdrop, matching the web dialog surface.
 * It is applied to a wrapper rather than the dialog card itself, because the card clips its
 * own shadow on iOS (its "overflow-hidden" maps to a layer mask).
 */
const dialogShadowStyle: ViewStyle = {
  boxShadow: MODAL_BOX_SHADOW,
};

/**
 * A provider component that manages the state and display of React Native dialogs on mobile.
 *
 * @param root0 Params.
 * @param root0.children Child nodes - basically the screen content.
 * @returns A React element that provides dialog functionality to its children.
 */
export function SmartyDialogProvider({children}: {children: ReactNode}) {
  const {dialogProps, showDialog, dismissDialog, onDismissCleanup} =
    useSmartyDialogState();
  const modalOverlayColor = useColorForModalOverlay();

  // Android's back button dismisses the dialog, unless it opts out, rather than navigating the screen behind it, as
  // the dialog isn't a Modal and so doesn't receive back presses itself.
  // The listener is added when the dialog opens, after navigation's own, so it's called first.
  const isOpen = !!dialogProps;
  const dismissOnBack =
    dialogProps?.dismissOnBack ?? MODAL_DISMISS_ON_BACK_DEFAULT;
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (dismissOnBack) {
          dismissDialog();
        }
        return true; // Handled, so the screen behind doesn't go back, even if the dialog stays open.
      },
    );
    return () => subscription.remove();
  }, [isOpen, dismissOnBack, dismissDialog]);

  const showAlertDialog = useCallback(
    (
      title: string,
      message: string,
      buttons?: AlertButton[],
      options?: AlertOptions,
    ) => {
      const enhancedButtons = createAlertDialogButtons(
        onDismissCleanup,
        buttons,
      );
      // Use native alert.
      Alert.alert(title, message, enhancedButtons, options);
    },
    [onDismissCleanup],
  );

  // Memoised so consumers get stable references, and are not re-rendered whenever a dialog is shown or dismissed.
  const contextValue = useMemo(
    () => ({showDialog, showAlertDialog, dismissDialog}),
    [showDialog, showAlertDialog, dismissDialog],
  );

  return (
    <SmartyDialogContext.Provider value={contextValue}>
      {/* Hides the screen behind an open dialog from TalkBack.  On iOS, accessibilityViewIsModal below does this. */}
      <View
        className="flex-1"
        importantForAccessibility={
          dialogProps ? 'no-hide-descendants' : 'auto'
        }>
        {children}
      </View>

      {dialogProps && (
        <View
          testID="background-view"
          accessibilityViewIsModal
          // VoiceOver's escape gesture (a two-finger "Z") is iOS's equivalent of the back button, so it follows the
          // same rule.  It's always handled, so it never reaches the screen behind, even if the dialog stays open.
          onAccessibilityEscape={() => {
            if (dismissOnBack) {
              dismissDialog();
            }
          }}
          className="absolute inset-0 justify-center items-center smarty-px-l"
          style={{
            backgroundColor: modalOverlayColor,
          }}>
          {/* Tapping the backdrop dismisses the dialog, unless it opts out.  It sits behind the card, so taps on the card itself don't reach it. */}
          {(dialogProps.dismissOnPressOutside ??
            MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT) && (
            <Pressable
              testID="background-dismiss"
              className="absolute inset-0"
              onPress={dismissDialog}
              // Screen readers close the dialog with its close button instead.
              accessible={false}
              importantForAccessibility="no"
            />
          )}
          {/* The wrapper carries the shadow, and matches the card's background and radius so the shadow takes the card's shape. */}
          <View className="w-full smarty-rounded-xl" style={dialogShadowStyle}>
            <SmartyDialog {...dialogProps} />
          </View>
        </View>
      )}
    </SmartyDialogContext.Provider>
  );
}
