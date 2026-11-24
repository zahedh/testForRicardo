import {RefObject} from 'react';

/**
 * A custom hook to manage background accessibility when a modal dialog is open.
 * Platform-specific implementation.
 * Note that we require an implementation of this for web.
 *
 * @param isDialogOpen Whether the dialog is currently open
 * @param dialogRef A ref to the dialog container element
 */
export function useDialogBackgroundAccessibility(
  isDialogOpen: boolean,
  dialogRef: RefObject<HTMLDivElement | null>,
): void;
