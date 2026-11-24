import {RefObject, useEffect} from 'react';

interface SavedAttributes {
  element: Element;
  inert: string | null;
  ariaHidden: string | null;
}

/**
 * Hides everything behind an open modal dialog from screen readers and
 * keyboard focus, as `aria-modal` alone isn't honoured by every screen reader.
 *
 * Every top-level element of the page that doesn't contain the dialog is made
 * `inert` and `aria-hidden` while the dialog is open, and restored afterwards.
 *
 * @param isDialogOpen - Whether the dialog is currently open.
 * @param dialogRef - A ref to the dialog container element.
 */
export function useDialogBackgroundAccessibility(
  isDialogOpen: boolean,
  dialogRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isDialogOpen || !dialog) {
      return;
    }

    const saved: SavedAttributes[] = Array.from(document.body.children)
      .filter((element) => !element.contains(dialog))
      .map((element) => ({
        element,
        inert: element.getAttribute('inert'),
        ariaHidden: element.getAttribute('aria-hidden'),
      }));

    for (const {element} of saved) {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    }

    return () => {
      for (const {element, inert, ariaHidden} of saved) {
        restoreAttribute(element, 'inert', inert);
        restoreAttribute(element, 'aria-hidden', ariaHidden);
      }
    };
  }, [isDialogOpen, dialogRef]);
}

/**
 * @param element - The element to restore.
 * @param name - The attribute's name.
 * @param value - The attribute's previous value, or null if it had none.
 */
function restoreAttribute(
  element: Element,
  name: string,
  value: string | null,
): void {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}
