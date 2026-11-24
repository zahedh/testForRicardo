import {BackButtonType} from '@smarty-app/core';
import {createContext, useCallback, useContext} from 'react';
import {Platform} from 'react-native';

/**
 * Properties for modal "content sheets" (i.e. bottom sheets on mobile and dialogs on web).
 */
export interface ContentSheetProps {
  title?: string;
  subtitle?: string;
  content: React.ReactNode;
  /** Optional callback function that is called when the modal is dismissed (either manually or programmatically). */
  onDismiss?: () => void;
  /** Leading button type. Defaults to BackButtonType.Close; use BackButtonType.None to hide it. */
  closeButtonType?: BackButtonType;
  /** If defined, a "Close" button will be added, with the specified callback executed when pressed. */
  onClosePress?: () => void;
  /** If defined, an "Okay" button will be added, with the specified callback executed when pressed. */
  onOkayPress?: () => void;
  /** If true, standard horizontal and bottom padding will be added. True by default. */
  addContentPadding?: boolean;
  /**
   * If true, the modal can also be dismissed by tapping or clicking outside it, or on mobile by dragging the bottom
   * sheet's handle down.  If false, the handle is hidden.
   * Defaults to {@link MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT}.
   */
  dismissOnPressOutside?: boolean;
  /**
   * If true, the modal can also be dismissed with the back button on Android, VoiceOver's escape gesture on iOS, or
   * the Escape key on web.
   * Only set this to false if the content gives the user another way out, as screen reader users rely on it.
   * Defaults to {@link MODAL_DISMISS_ON_BACK_DEFAULT}.
   */
  dismissOnBack?: boolean;
}

/** Default for {@link ContentSheetProps.dismissOnPressOutside}. */
export const MODAL_DISMISS_ON_PRESS_OUTSIDE_DEFAULT = true;

/** Duration in milliseconds of the bottom sheet close animation. */
export const STANDARD_BOTTOM_SHEET_CLOSE_DURATION = 250;

/** Extra delay after the close animation, so the bottom sheet is fully gone before acting. */
const DISMISS_THEN_EXTRA_DELAY = 50;

/** Default for {@link ContentSheetProps.dismissOnBack}. */
export const MODAL_DISMISS_ON_BACK_DEFAULT = true;

type ShowContentSheetFn = (props: ContentSheetProps) => void;
type DismissContentSheetFn = () => void;

type ContentSheetContextValue = {
  showContentSheet: ShowContentSheetFn;
  dismissContentSheet: DismissContentSheetFn;
};

const contextNotProvidedError = () => {
  throw new Error(
    'SmartyContentSheetContext must be used within a SmartyContentSheetProvider',
  );
};

export const SmartyContentSheetContext =
  createContext<ContentSheetContextValue>({
    showContentSheet: contextNotProvidedError,
    dismissContentSheet: contextNotProvidedError,
  });

/**
 * A custom hook that provides access to "content sheet" functionality.
 * Content sheets are implemented as bottom sheets on mobile, and as modal dialogs on web.
 *
 * @returns A set of functions used to display content sheets.
 */
export function useSmartyContentSheet() {
  return useContext(SmartyContentSheetContext);
}

/**
 * A custom hook that returns a function to dismiss the content sheet and then run an action, such as opening a link.
 * On native the action waits until the bottom sheet has closed, because browsers and other sheets may not open while
 * a bottom sheet is still up or closing. On web it runs immediately, because a delayed window.open may be blocked as
 * a popup.
 *
 * Content inside a content sheet is rendered outside SmartyContentSheetProvider, so it cannot call
 * useSmartyContentSheet; pass in the dismissContentSheet obtained by whoever showed the sheet.
 *
 * @param dismissContentSheet - A function to dismiss the content sheet, if there is one.
 * @returns A function that dismisses the content sheet and then runs the given action.
 */
export function useDismissContentSheetThen(
  dismissContentSheet?: () => void,
): (action: () => void) => void {
  return useCallback(
    (action: () => void) => {
      dismissContentSheet?.();
      if (Platform.OS === 'web') {
        action();
      } else {
        setTimeout(
          action,
          STANDARD_BOTTOM_SHEET_CLOSE_DURATION + DISMISS_THEN_EXTRA_DELAY,
        );
      }
    },
    [dismissContentSheet],
  );
}

/**
 * nativeID given to the title of modal top bars, so the containing modal can be labelled by it (with aria-labelledby).
 * A fixed ID is safe because only one modal can be shown at a time.
 */
export const MODAL_TITLE_ID = 'modal-title';

/** Standard horizontal padding for dialogs and bottom sheets. */
export const MODAL_MARGIN_HORIZONTAL_DEFAULT =
  Platform.OS === 'web' ? 'smarty-mx-xl' : 'smarty-mx-l';

/** Standard bottom margin for dialogs and bottom sheets. */
export const MODAL_MARGIN_BOTTOM_DEFAULT =
  Platform.OS === 'web' ? 'smarty-mb-xl' : 'smarty-mb-l';
