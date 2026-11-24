/**
 * Color Tokens
 *
 * This file defines all color tokens used across the application.
 * Colors are organized into core palette colors and semantic colors.
 * Core colors are defined first so semantic colors can reference them.
 *
 */

// ===========================
// CORE COLORS
// ===========================
// Core palette colors from Figma that don't change with theme

export const core = {
  brand: {
    slate: {
      800: '#32373d',
    },
    teal: {
      100: '#e4f5f2',
      800: '#8fd6c9',
    },
    white: {
      0: '#ffffff',
    },
    blue: {
      100: '#e1f2ff',
      800: '#82c7ff',
    },
    pink: {
      100: '#fae7f8',
      800: '#f0b5e8',
    },
    purple: {
      100: '#e3dff9',
      800: '#b8aef1',
    },
  },
  accent: {
    teal: {
      850: '#2bb5a7',
      900: '#229b93',
    },
    slate: {
      100: '#e2e2e2',
      200: '#bebec0',
      600: '#5a666d',
      700: '#3c454a',
      900: '#292e33',
    },
    yellow: {
      100: '#fff8ea',
      800: '#ffd67d',
    },
    wave: {
      100: '#cce8f1',
      800: '#17b5d9',
    },
    aqua: {
      100: '#d3f6fb',
      800: '#92e9f6',
    },
    cornflour: {
      100: '#cddcf9',
      800: '#8dace5',
    },
    ocean: {
      100: '#e3ecff',
      800: '#aecaff',
    },
    iceberg: {
      100: '#dcedff',
      800: '#b3cde7',
    },
    sky: {
      100: '#e0f5f8',
      800: '#a9d4da',
    },
    sandcastle: {
      100: '#ffeac1',
      800: '#f2c36b',
    },
    peach: {
      100: '#fcf2e9',
      800: '#fcd8ae',
    },
    peony: {
      100: '#ffdff2',
      800: '#df90be',
    },
    rose: {
      100: '#fcecf0',
      800: '#f8c4d1',
    },
    petal: {
      100: '#ffe4ed',
      800: '#f4a8c2',
    },
    lavander: {
      100: '#eedfff',
      800: '#ceb1ed',
    },
    lilac: {
      100: '#f4d5f8',
      800: '#e496ee',
    },
    jade: {
      100: '#d7fae7',
      800: '#79d598',
    },
    sage: {
      100: '#c7f6c3',
      800: '#90df89',
    },
    olive: {
      100: '#edf4db',
      800: '#cddf99',
    },
    pistachio: {
      100: '#e9ffd4',
      800: '#cbfd9b',
    },
    lime: {
      100: '#f4ffdd',
      800: '#dbff8e',
    },
    leaf: {
      100: '#e4ecc8',
      800: '#c1d86c',
    },
    mandarine: {
      100: '#ffeae1',
      800: '#ff9569',
    },
    coral: {
      100: '#ffe0e4',
      800: '#ff7c8c',
    },
    red: {
      100: '#fad6d6',
      800: '#e00000',
    },
    nectar: '#faa582',
  },
} as const;

// ===========================
// SEMANTIC COLORS
// ===========================
// These colors represent functional meanings and adapt to light/dark themes
// Where possible, they reference core colors to maintain consistency

export const semantic = {
  foreground: {
    primary: {
      light: core.brand.slate[800],
      dark: core.brand.white[0],
    },
    secondary: {
      light: core.accent.slate[600],
      dark: core.accent.slate[200],
    },
    tertiary: {
      light: core.accent.slate[200],
      dark: core.brand.slate[800],
    },
    accent: {
      light: core.accent.teal[900],
      dark: core.brand.teal[800],
    },
    warning: {
      light: core.accent.red[800],
      dark: core.accent.coral[800],
    },
    promo: {
      light: core.accent.sandcastle[800],
      dark: core.accent.sandcastle[800],
    },
  },
  background: {
    primary: {
      light: core.brand.white[0],
      dark: core.accent.slate[900],
    },
    secondary: {
      light: '#F2F2F2',
      dark: core.brand.slate[800],
    },
    tertiary: {
      light: core.accent.slate[100],
      dark: core.accent.slate[700],
    },
    accent: {
      light: core.brand.teal[800],
      dark: core.brand.teal[800],
    },
    promo: {
      light: core.accent.yellow[800],
      dark: core.accent.yellow[800],
    },
    transparent: {
      light: 'rgba(255, 255, 255, 0)',
      dark: 'rgba(0, 0, 0, 0)',
    },
  },
  stroke: {
    strong: {
      light: core.accent.slate[600],
      dark: core.accent.slate[200],
    },
    medium: {
      light: core.accent.slate[200],
      dark: core.accent.slate[600],
    },
    light: {
      // TODO: Design still needs to provide this colour.
      light: '#717A82',
      dark: '#717A82',
    },
  },
  overlay: {
    modal: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(60, 69, 74, 0.8)',
    },
  },
  accessibility: {
    focusBorder: {
      light: core.brand.blue[800],
      dark: core.brand.blue[800],
    },
  },
} as const;

/**
 * A semantic colour token holding its light and dark theme variants.
 */
export interface ThemeColorVariants {
  /** Value used in the light theme. */
  light: string;
  /** Value used in the dark theme. */
  dark: string;
}

/**
 * Resolves a semantic colour token to its light or dark variant based on the
 * active colour scheme.
 *
 * @param variants - Semantic colour token containing `light` and `dark` values.
 * @param colorScheme - Active colour scheme; anything other than `'dark'` resolves to the light variant.
 * @returns The colour value for the active colour scheme.
 */
export function resolveThemeColor(
  variants: ThemeColorVariants,
  colorScheme: 'light' | 'dark' | null | undefined,
): string {
  return colorScheme === 'dark' ? variants.dark : variants.light;
}
