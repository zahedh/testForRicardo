import {en} from '@smarty-app/language';
import {createContext, useCallback, useContext, useRef, useState} from 'react';
import {AlertButton, AlertOptions} from 'react-native';

import {ContentSheetProps} from '../..';

export interface SmartyDialogProps extends ContentSheetProps {
  isAlert?: boolean;
  testID?: string;
}

export interface SmartyAlertDialogProps {
  message: string;
  buttons?: AlertButton[];
  options?: AlertOptions;
}

type ShowDialogFn = (props: SmartyDialogProps) => void;

type ShowAlertDialogFn = (
  title: string,
  message: string,
  buttons?: AlertButton[],
  options?: AlertOptions,
) => void;

type DismissDialogFn = () => void;

type DialogContextValue = {
  showDialog: ShowDialogFn;
  showAlertDialog: ShowAlertDialogFn;
  dismissDialog: DismissDialogFn;
};

/**
 * Returned by {@link useSmartyDialogState}.
 */
type DialogState = {
  dialogProps: SmartyDialogProps | null;
  showDialog: ShowDialogFn;
  dismissDialog: DismissDialogFn;
  onDismissCleanup: () => void;
};

const contextNotProvidedError = () => {
  throw new Error(
    'SmartyDialogContext must be used within a SmartyDialogProvider',
  );
};

export const SmartyDialogContext = createContext<DialogContextValue>({
  showDialog: contextNotProvidedError,
  showAlertDialog: contextNotProvidedError,
  dismissDialog: contextNotProvidedError,
});

/**
 * A custom hook that provides access to modal dialog functionality.
 *
 * @returns A set of functions used to display modal dialogs.
 */
export function useSmartyDialog() {
  return useContext(SmartyDialogContext);
}

/**
 * Holds the state shared by the mobile and web SmartyDialogProviders: the dialog currently shown, and the functions
 * to show and dismiss it.  The functions are stable, so they're safe to put in context and effect dependencies.
 *
 * @returns The current dialog's props, or null if none is shown, with showDialog, dismissDialog and onDismissCleanup.
 */
export function useSmartyDialogState(): DialogState {
  const [dialogProps, setDialogProps] = useState<SmartyDialogProps | null>(
    null,
  );

  // Dismisses the current dialog, including its consumer's onDismiss callback.  Held in a ref rather than read from
  // dialogProps, as dismissDialog is often called from closures created before the dialog was shown.
  const dismissCurrentDialogRef = useRef<(() => void) | null>(null);

  // Closes the dialog without calling its consumer's onDismiss callback.
  const onDismissCleanup = useCallback(() => {
    dismissCurrentDialogRef.current = null;
    setDialogProps(null);
  }, []);

  const showDialog = useCallback(
    (props: SmartyDialogProps) => {
      const onDismiss = () => {
        props.onDismiss?.();
        onDismissCleanup(); // Actually close the dialog.
      };
      dismissCurrentDialogRef.current = onDismiss;
      setDialogProps({...props, onDismiss});
    },
    [onDismissCleanup],
  );

  const dismissDialog = useCallback(() => {
    dismissCurrentDialogRef.current?.();
  }, []);

  return {dialogProps, showDialog, dismissDialog, onDismissCleanup};
}

/**
 * Takes a basic array of buttons and add the specified onDismiss callback to each.
 * If there are no buttons, a basic "OK" button is added, as happens with React Native's Alert.
 *
 * @param onDismiss A callback function to be called when the dialog is dismissed.
 * @param buttons The original buttons, if any.
 * @returns An array of AlertButtons with onDismiss added to each onPress.
 */
export function createAlertDialogButtons(
  onDismiss: () => void,
  buttons?: AlertButton[],
): AlertButton[] {
  const basicButtons =
    buttons && buttons.length > 0 ? buttons : [{text: en.ok}];

  return basicButtons.map((btn) => ({
    ...btn,
    onPress: () => {
      btn.onPress?.();
      onDismiss();
    },
  }));
}
