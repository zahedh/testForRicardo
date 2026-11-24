import {darkColors, lightColors} from '@smarty-app/design-tokens';
import {useColorScheme} from 'nativewind';
import {useMemo} from 'react';
import * as tailwindColors from 'tailwindcss/colors';

const tailwindColorsLookup: Record<string, unknown> = Object.fromEntries(
  Object.entries(tailwindColors),
);

/**
 * Supported app theme names for resolving semantic color variables.
 */
export type TailwindColorTheme = 'light' | 'dark';

/**
 * Options for resolving a Tailwind color token to a concrete color value.
 */
export interface TailwindColorResolverOptions {
  /** Theme used when resolving SMARTY CSS variable-backed tokens. */
  theme?: TailwindColorTheme;
}

type ThemeVariableMap = Record<string, string>;

/**
 * Resolves a Tailwind color token into a concrete color value.
 *
 * Supports:
 * - Default Tailwind tokens (e.g. `slate-700`)
 * - SMARTY tokens backed by CSS variables (e.g. `accent-slate-700`)
 * - Utility-prefixed tokens (e.g. `bg-accent-slate-700`)
 * - CSS variable expressions (e.g. `var(--color-accent-slate-700)`)
 *
 * @param colorToken - Tailwind color token, utility token, or CSS var expression.
 * @param options - Resolver options including theme.
 * @returns Resolved color value (typically hex) or `undefined` if no mapping exists.
 */
export function resolveTailwindColorToHex(
  colorToken: string | undefined | null,
  options: TailwindColorResolverOptions = {},
): string | undefined {
  const token = colorToken ? normalizeColorToken(colorToken) : '';
  if (!token) {
    return undefined;
  }

  if (isHexColor(token)) {
    return token;
  }

  const variableMap = getThemeVariableMap(options.theme ?? 'dark');
  const themeValue = resolveThemeVariableValue(token, variableMap);
  if (themeValue) {
    return themeValue;
  }

  return resolveDefaultTailwindToken(token);
}

/**
 * React hook that resolves a Tailwind color token into a concrete color value,
 * automatically tracking the current NativeWind color scheme (light/dark) as the theme.
 *
 * @param colorToken - Tailwind color token, utility token, or CSS var expression.
 * @returns Resolved color value (typically hex) or `undefined` if no mapping exists.
 */
export function useResolveTailwindColorToHex(
  colorToken: string | undefined | null,
): string | undefined {
  const {colorScheme} = useColorScheme();

  return useMemo(
    () =>
      resolveTailwindColorToHex(colorToken, {
        theme: colorScheme === 'light' ? 'light' : 'dark',
      }),
    [colorToken, colorScheme],
  );
}

function getThemeVariableMap(theme: TailwindColorTheme): ThemeVariableMap {
  return (theme === 'dark' ? darkColors : lightColors) as ThemeVariableMap;
}

function resolveThemeVariableValue(
  token: string,
  variableMap: ThemeVariableMap,
): string | undefined {
  const variableName = normalizeThemeVariableName(token);
  return variableName ? variableMap[variableName] : undefined;
}

function normalizeThemeVariableName(token: string): string | undefined {
  if (token.startsWith('--color-')) {
    return token;
  }

  if (token.startsWith('var(')) {
    return extractCssVariableName(token);
  }

  return `--color-${token}`;
}

function normalizeColorToken(token: string): string {
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return '';
  }

  const unwrappedArbitraryToken = trimmedToken.replace(/^\[(.*)\]$/, '$1');
  const variantSegment = unwrappedArbitraryToken
    .split(':')
    .at(-1)
    ?.replace(/^!/, '');

  if (!variantSegment) {
    return '';
  }

  const utilityMatch =
    /^(bg|text|border|from|to|via|ring|stroke|fill)-(.+)$/.exec(variantSegment);

  return utilityMatch ? utilityMatch[2] : variantSegment;
}

function extractCssVariableName(token: string): string | undefined {
  const cssVariableMatch = /var\((--[a-z0-9-]+)\)/i.exec(token);
  return cssVariableMatch?.[1];
}

function isHexColor(token: string): boolean {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(token);
}

function resolveDefaultTailwindToken(token: string): string | undefined {
  const tokenParts = token.split('-');
  const shade = tokenParts.at(-1);

  if (shade && /^\d+$/.test(shade) && tokenParts.length > 1) {
    const colorFamily = tokenParts.slice(0, -1).join('-');
    const familyValue = tailwindColorsLookup[colorFamily] as
      Record<string, string> | undefined;

    return familyValue?.[shade];
  }

  const directValue = tailwindColorsLookup[token];
  return typeof directValue === 'string' ? directValue : undefined;
}
