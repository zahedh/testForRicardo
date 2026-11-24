'use client';

import {SmartyAlertPanel} from '@smarty-app/controls';
import {cn} from '@smarty-app/controls-basic';
import {MODAL_BOX_SHADOW} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import {ApiErrorStateStore, useApiErrorStateStore} from '@smarty-app/ui-state';
import {JSX} from 'react';
import {Platform, View, ViewStyle} from 'react-native';

const WEB = Platform.OS === 'web';

/**
 * Drop shadow lifting the panel off the screen behind it, which shares its background colour.
 * Native only, as on web the "shadow-modal" class (the same MODAL_BOX_SHADOW) is used instead.
 * It is applied to a wrapper rather than the panel itself, because the panel clips its own
 * shadow on iOS (its "overflow-hidden" maps to a layer mask).
 */
const panelShadowStyle: ViewStyle = {
  boxShadow: MODAL_BOX_SHADOW,
};

type ApiErrorAlertPanelProps = {
  className?: string;
  top?: number;
  /** Whether to show a drop shadow, e.g. when the panel floats over content with the same background. Defaults to false. */
  shadow?: boolean;
};

/**
 * Renders an alert panel with the current API error message.
 *
 * @param props Element props.
 * @returns a JSX.Element or null if there is no API error message
 */
export function ApiErrorAlertPanel(
  props: ApiErrorAlertPanelProps,
): JSX.Element | null {
  const {className, top, shadow = false} = props;

  const {errorText, reset} = useApiErrorStateStore(
    (state: ApiErrorStateStore) => ({
      errorText: state.errorText,
      reset: state.reset,
    }),
    true,
  );

  /*const {isInternetReachable, onForceConnectionRecheck} =
    useIsInternetReachable();

  useEffect(() => {
    if (errorText) {
      onForceConnectionRecheck();
    }
  }, [errorText, onForceConnectionRecheck]);*/
  const isInternetReachable = true; // TODO: Restore real check.

  return errorText && isInternetReachable ? (
    <View className={className} style={{top: top}}>
      {/* The wrapper carries any shadow, matching the panel's radius so the shadow takes its shape. */}
      <View
        className={cn('smarty-rounded-xl', shadow && WEB && 'shadow-modal')}
        style={shadow && !WEB ? panelShadowStyle : undefined}>
        <SmartyAlertPanel
          testID="api-error-alert-panel"
          alertType="error"
          alertTitle={en.error}
          alertBodyText={errorText}
          onDismiss={reset}
        />
      </View>
    </View>
  ) : null;
}
