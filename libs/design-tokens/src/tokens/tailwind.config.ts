/**
 * Tailwind Preset
 *
 * Shared Tailwind preset for the web (Next.js) and app (NativeWind) configs, which load it
 * from source with `require(...).default`. Every value comes from the token files in this
 * folder, so the class names stay in step with the tokens.
 *
 * - Colors: `bg-background-primary`, `text-foreground-accent`, `border-stroke-medium`,
 *   `bg-accent-teal-850` and so on. Each one reads its CSS variable, which `web/theme.css`
 *   sets on web and the app's ThemeProvider sets through NativeWind `vars()` on native, so
 *   light and dark themes switch without new class names.
 * - Fonts: `font-theme`, `font-theme-bold`, `font-theme-italic`, `font-theme-bold-italic`.
 * - Shadow: `shadow-modal`.
 * - Utilities: the `smarty-*` spacing, negative margin, border radius and typography classes.
 */

import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import {lightColors} from './app/colors.light';
import {MODAL_BOX_SHADOW} from './shadows';
import {
  borderRadiusUtilities,
  negativeMarginUtilities,
  spacingUtilities,
} from './spacing';
import {fontFamily, typographyUtilities} from './typography';

const COLOR_VARIABLE_PREFIX = '--color-';

/**
 * Maps each colour variable to a Tailwind colour name, e.g. `--color-foreground-primary`
 * becomes `foreground-primary: var(--color-foreground-primary)`. The light and dark maps
 * hold the same variables, so either one gives the full list.
 */
const themeColors = Object.fromEntries(
  Object.keys(lightColors).map((variable) => [
    variable.slice(COLOR_VARIABLE_PREFIX.length),
    `var(${variable})`,
  ]),
);

const themeFontFamily = Object.fromEntries(
  Object.entries(fontFamily)
    // `sans` and `mono` are empty placeholders; leave Tailwind's defaults in place.
    .filter(([, families]) => families.length > 0)
    .map(([name, families]) => [name, [...families]]),
);

const preset = {
  content: [],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: themeFontFamily,
      boxShadow: {
        modal: MODAL_BOX_SHADOW,
      },
    },
  },
  plugins: [
    plugin(({addUtilities}) => {
      addUtilities(spacingUtilities);
      addUtilities(negativeMarginUtilities);
      addUtilities(borderRadiusUtilities);
      addUtilities(typographyUtilities);
    }),
  ],
} satisfies Config;

export default preset;
