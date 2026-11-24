/**
 * Shadow that lifts modals like dialogs and bottom sheets off the dimmed backdrop.
 *
 * Written in CSS `box-shadow` syntax, which React Native's `boxShadow` style also accepts, so the same value is used
 * inline on native and as the `shadow-modal` Tailwind class on web. No vertical offset, so the shadow spreads evenly
 * around the modal.
 */
export const MODAL_BOX_SHADOW = '0px 0px 40px rgba(0, 0, 0, 0.35)';
