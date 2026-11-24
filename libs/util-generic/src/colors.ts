import {
  resolveThemeColor,
  semantic,
  ThemeColorVariants,
} from '@smarty-app/design-tokens';
import {useColorScheme} from 'nativewind';
import {useCallback} from 'react';

/**
 * Returns the appropriate modal overlay color (the color overlaying the rest of the screen whilst the modal is displayed)
 * based on the current color scheme.
 *
 * @returns The hex value for the modal overlay color corresponding to the current color scheme (light or dark).
 */
export function useColorForModalOverlay(): string {
  const onResolveThemeColor = useOnResolveThemeColor();
  return onResolveThemeColor(semantic.overlay.modal);
}

export const MODAL_BACKGROUND_SEMANTIC_COLOR = 'bg-background-primary';
/**
 * Returns the appropriate modal background color (i.e. the color inside the modal).
 *
 * @returns The {@link ThemeColorVariants} for the modal background color.
 */
export function getColorForModalBackground(): ThemeColorVariants {
  return semantic.background.primary;
}

/**
 * Returns the appropriate modal background color (i.e. the color inside the modal) based on the current color scheme.
 *
 * @returns The hex value for the modal background color corresponding to the current color scheme (light or dark).
 */
export function useColorForModalBackground(): string {
  const onResolveThemeColor = useOnResolveThemeColor();
  return onResolveThemeColor(getColorForModalBackground());
}

/**
 * Hook providing a callback to resolve a semantic colour token to its light
 * or dark variant based on the current color scheme.
 *
 * @returns A callback that resolves a {@link ThemeColorVariants} token to its hex value for the active color scheme.
 */
export function useOnResolveThemeColor(): (
  variants: ThemeColorVariants,
) => string {
  const {colorScheme} = useColorScheme();
  return useCallback(
    (variants: ThemeColorVariants) => resolveThemeColor(variants, colorScheme),
    [colorScheme],
  );
}

/**
 * Suffixes a 6 digit hex color with an 8 bit alpha channel.
 *
 * @param hexColor - A `#rrggbb` color, as stored in the design tokens.
 * @param alpha - Opacity between 0 (transparent) and 1 (opaque).
 * @returns The color as `#rrggbbaa`.
 */
export function withAlpha(hexColor: string, alpha: number): string {
  const alphaChannel = Math.round(alpha * 0xff)
    .toString(16)
    .padStart(2, '0');
  return `${hexColor}${alphaChannel}`;
}
