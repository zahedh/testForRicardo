import {borderRadiusUtilities} from '@smarty-app/design-tokens';

const REM_TO_PX = 16;

/**
 * Converts a CSS length token (`rem` or `px`) to a numeric pixel value.
 *
 * @param value - The CSS length string, e.g. `'0.75rem'` or `'12px'`.
 * @returns The equivalent value in pixels.
 */
export function remToPx(value: string): number {
  return value.trim().endsWith('rem')
    ? parseFloat(value) * REM_TO_PX
    : parseFloat(value);
}

/**
 * The `smarty-rounded-*` utilities that set a single, uniform radius.
 * The `-t-`/`-b-` variants are excluded as they only set per-corner radii.
 */
export type SmartyRadiusName = Exclude<
  keyof typeof borderRadiusUtilities,
  `.smarty-rounded-${'t' | 'b'}-${string}`
>;

/**
 * Resolves a `smarty-rounded-*` utility to its radius in pixels, for native APIs
 * that take a number rather than a className (e.g. `sheetCornerRadius`).
 *
 * @param name - The utility key, including its leading dot.
 * @returns The corner radius, in pixels.
 */
export function getSmartyRadius(name: SmartyRadiusName): number {
  return remToPx(borderRadiusUtilities[name].borderRadius);
}
