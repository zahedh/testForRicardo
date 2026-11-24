import {cn} from '@smarty-app/controls-basic';
import {BackButtonType} from '@smarty-app/core';
import {useColorForModalOverlay} from '@smarty-app/util-generic';
import {ReactNode, useCallback, useEffect, useMemo, useRef} from 'react';
import {createPortal} from 'react-dom';
import {AlertButton, AlertOptions} from 'react-native';

import {
  MODAL_DISMISS_ON_BACK_DEFAULT,
  MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT,
  MODAL_TITLE_ID,
} from '../content-sheet/hooks/contentSheetHooks';
import {useDialogBackgroundAccessibility} from './hooks/dialogHooks';
import {
  createAlertDialogButtons,
  SmartyDialogContext,
  useSmartyDialogState,
} from './hooks/smartyDialogHooks';
import {SmartyAlertDialogContent, SmartyDialog} from './SmartyDialog';

/**
 * A provider component that manages the state and display of React Native dialogs on web.
 *
 * @param root0 Params.
 * @param root0.children Child nodes - basically the screen content.
 * @returns A React element that provides dialog functionality to its children.
 */
export function SmartyDialogProvider({children}: {children: ReactNode}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const {dialogProps, showDialog, dismissDialog, onDismissCleanup} =
    useSmartyDialogState();
  const modalOverlayColor = useColorForModalOverlay();

  // Whether the backdrop was pressed, as opposed to the dialog.  Clicking the backdrop only dismisses if the press also
  // started on it, so selecting text in the dialog and releasing outside it doesn't close it.
  const pressStartedOnBackdropRef = useRef(false);

  useDialogBackgroundAccessibility(!!dialogProps, dialogRef);

  // Whether clicking the backdrop dismisses the dialog.
  const dismissOnPressOutside =
    !!dialogProps &&
    (dialogProps.dismissOnPressOutside ??
      MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT);

  // The Escape key, web's equivalent of the back button, dismisses the dialog, unless it opts out.
  const dismissOnBack =
    !!dialogProps &&
    (dialogProps.dismissOnBack ?? MODAL_DISMISS_ON_BACK_DEFAULT);
  useEffect(() => {
    if (!dismissOnBack) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // Leave the key alone if a control inside the dialog already handled it (e.g. closing a dropdown), or if it's
      // cancelling IME composition.
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.isComposing
      ) {
        return;
      }
      event.preventDefault();
      dismissDialog();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dismissOnBack, dismissDialog]);

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
      const content = (
        <SmartyAlertDialogContent
          {...{title, message, buttons: enhancedButtons, options}}
        />
      );

      // As with Android's native alert, an alert must be answered with one of its buttons unless it's cancelable, and
      // its onDismiss is only called when it's cancelled, not when a button is pressed.
      const cancelable = options?.cancelable ?? false;
      showDialog({
        title: title,
        content,
        closeButtonType: BackButtonType.None,
        isAlert: true,
        dismissOnPressOutside: cancelable,
        dismissOnBack: cancelable,
        onDismiss: options?.onDismiss,
      });
    },
    [showDialog, onDismissCleanup],
  );

  // Memoised so consumers get stable references, and are not re-rendered whenever a dialog is shown or dismissed.
  const contextValue = useMemo(
    () => ({showDialog, showAlertDialog, dismissDialog}),
    [showDialog, showAlertDialog, dismissDialog],
  );

  return (
    <SmartyDialogContext.Provider value={contextValue}>
      {children}

      {dialogProps &&
        (() => {
          const modalRoot = document.getElementById('modal-root');
          // Label the dialog with its own title, if it has one.
          const labelledByID = dialogProps.title ? MODAL_TITLE_ID : undefined;
          return modalRoot
            ? createPortal(
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center smarty-px-l"
                  style={{
                    backgroundColor: modalOverlayColor,
                  }}
                  // Clicking the backdrop dismisses the dialog, unless it opts out.  Keyboard and screen reader
                  // users have the Escape key and the close button instead, so the backdrop isn't focusable.
                  onPointerDown={(event) => {
                    pressStartedOnBackdropRef.current =
                      event.target === event.currentTarget;
                  }}
                  onClick={(event) => {
                    if (
                      dismissOnPressOutside &&
                      pressStartedOnBackdropRef.current &&
                      event.target === event.currentTarget
                    ) {
                      dismissDialog();
                    }
                  }}>
                  <div
                    ref={dialogRef}
                    // The wrapper owns the dialog's layout (width), and the card inside fills it.
                    // Alerts are kept narrower than general dialogs.
                    className={cn(
                      'w-full',
                      dialogProps.isAlert ? 'max-w-md' : 'max-w-[848px]', // Max width from Figma.
                    )}
                    role={dialogProps.isAlert ? 'alertdialog' : 'dialog'} // With "alertdialog", the dialog's title will be read out by Voiceover.
                    tabIndex={-1} // Not selectable with tab, but can receive focus programmatically.
                    aria-modal="true"
                    aria-labelledby={labelledByID}>
                    {/* The card owns the dialog's surface styling, including its web shadow. */}
                    <SmartyDialog {...dialogProps} />
                  </div>
                </div>,
                modalRoot,
              )
            : null;
        })()}
    </SmartyDialogContext.Provider>
  );
}
