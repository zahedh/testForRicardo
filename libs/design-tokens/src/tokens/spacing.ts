/**
 * Spacing Tokens
 *
 * Standard Tailwind spacing scale.
 * Used for general margin, padding, gap utilities.
 * Semantic design tokens (smarty-p-m, etc.) use specific Figma values defined in tailwind.config.ts
 */

export const spacing = {
  0: '0rem', // 0px
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

export type SpacingKey = keyof typeof spacing;

// ===========================
// SPACING UTILITIES
// ===========================
// Custom utilities for padding, margin, and gap with semantic sizes
// Figma Design System

export const spacingUtilities = {
  // ===========================
  // PADDING UTILITIES
  // Figma Design System - Semantic Sizes
  // ===========================
  // XS: 4px
  '.smarty-p-xs': {padding: spacing[1]},
  '.smarty-pt-xs': {paddingTop: spacing[1]},
  '.smarty-pr-xs': {paddingRight: spacing[1]},
  '.smarty-pb-xs': {paddingBottom: spacing[1]},
  '.smarty-pl-xs': {paddingLeft: spacing[1]},
  '.smarty-px-xs': {paddingLeft: spacing[1], paddingRight: spacing[1]},
  '.smarty-py-xs': {paddingTop: spacing[1], paddingBottom: spacing[1]},

  // S: 8px
  '.smarty-p-s': {padding: spacing[2]},
  '.smarty-pt-s': {paddingTop: spacing[2]},
  '.smarty-pr-s': {paddingRight: spacing[2]},
  '.smarty-pb-s': {paddingBottom: spacing[2]},
  '.smarty-pl-s': {paddingLeft: spacing[2]},
  '.smarty-px-s': {paddingLeft: spacing[2], paddingRight: spacing[2]},
  '.smarty-py-s': {paddingTop: spacing[2], paddingBottom: spacing[2]},

  // M: 12px
  '.smarty-p-m': {padding: spacing[3]},
  '.smarty-pt-m': {paddingTop: spacing[3]},
  '.smarty-pr-m': {paddingRight: spacing[3]},
  '.smarty-pb-m': {paddingBottom: spacing[3]},
  '.smarty-pl-m': {paddingLeft: spacing[3]},
  '.smarty-px-m': {paddingLeft: spacing[3], paddingRight: spacing[3]},
  '.smarty-py-m': {paddingTop: spacing[3], paddingBottom: spacing[3]},

  // L: 16px
  '.smarty-p-l': {padding: spacing[4]},
  '.smarty-pt-l': {paddingTop: spacing[4]},
  '.smarty-pr-l': {paddingRight: spacing[4]},
  '.smarty-pb-l': {paddingBottom: spacing[4]},
  '.smarty-pl-l': {paddingLeft: spacing[4]},
  '.smarty-px-l': {paddingLeft: spacing[4], paddingRight: spacing[4]},
  '.smarty-py-l': {paddingTop: spacing[4], paddingBottom: spacing[4]},

  // XL: 24px
  '.smarty-p-xl': {padding: spacing[6]},
  '.smarty-pt-xl': {paddingTop: spacing[6]},
  '.smarty-pr-xl': {paddingRight: spacing[6]},
  '.smarty-pb-xl': {paddingBottom: spacing[6]},
  '.smarty-pl-xl': {paddingLeft: spacing[6]},
  '.smarty-px-xl': {paddingLeft: spacing[6], paddingRight: spacing[6]},
  '.smarty-py-xl': {paddingTop: spacing[6], paddingBottom: spacing[6]},

  // 2XL: 32px
  '.smarty-p-2xl': {padding: spacing[8]},
  '.smarty-pt-2xl': {paddingTop: spacing[8]},
  '.smarty-pr-2xl': {paddingRight: spacing[8]},
  '.smarty-pb-2xl': {paddingBottom: spacing[8]},
  '.smarty-pl-2xl': {paddingLeft: spacing[8]},
  '.smarty-px-2xl': {paddingLeft: spacing[8], paddingRight: spacing[8]},
  '.smarty-py-2xl': {paddingTop: spacing[8], paddingBottom: spacing[8]},

  // 3XL: 64px
  '.smarty-p-3xl': {padding: spacing[16]},
  '.smarty-pt-3xl': {paddingTop: spacing[16]},
  '.smarty-pr-3xl': {paddingRight: spacing[16]},
  '.smarty-pb-3xl': {paddingBottom: spacing[16]},
  '.smarty-pl-3xl': {paddingLeft: spacing[16]},
  '.smarty-px-3xl': {paddingLeft: spacing[16], paddingRight: spacing[16]},
  '.smarty-py-3xl': {paddingTop: spacing[16], paddingBottom: spacing[16]},

  // ===========================
  // MARGIN UTILITIES
  // Figma Design System - Semantic Sizes
  // ===========================
  // XS: 4px
  '.smarty-m-xs': {margin: spacing[1]},
  '.smarty-mt-xs': {marginTop: spacing[1]},
  '.smarty-mr-xs': {marginRight: spacing[1]},
  '.smarty-mb-xs': {marginBottom: spacing[1]},
  '.smarty-ml-xs': {marginLeft: spacing[1]},
  '.smarty-mx-xs': {marginLeft: spacing[1], marginRight: spacing[1]},
  '.smarty-my-xs': {marginTop: spacing[1], marginBottom: spacing[1]},

  // S: 8px
  '.smarty-m-s': {margin: spacing[2]},
  '.smarty-mt-s': {marginTop: spacing[2]},
  '.smarty-mr-s': {marginRight: spacing[2]},
  '.smarty-mb-s': {marginBottom: spacing[2]},
  '.smarty-ml-s': {marginLeft: spacing[2]},
  '.smarty-mx-s': {marginLeft: spacing[2], marginRight: spacing[2]},
  '.smarty-my-s': {marginTop: spacing[2], marginBottom: spacing[2]},

  // M: 12px
  '.smarty-m-m': {margin: spacing[3]},
  '.smarty-mt-m': {marginTop: spacing[3]},
  '.smarty-mr-m': {marginRight: spacing[3]},
  '.smarty-mb-m': {marginBottom: spacing[3]},
  '.smarty-ml-m': {marginLeft: spacing[3]},
  '.smarty-mx-m': {marginLeft: spacing[3], marginRight: spacing[3]},
  '.smarty-my-m': {marginTop: spacing[3], marginBottom: spacing[3]},

  // L: 16px
  '.smarty-m-l': {margin: spacing[4]},
  '.smarty-mt-l': {marginTop: spacing[4]},
  '.smarty-mr-l': {marginRight: spacing[4]},
  '.smarty-mb-l': {marginBottom: spacing[4]},
  '.smarty-ml-l': {marginLeft: spacing[4]},
  '.smarty-mx-l': {marginLeft: spacing[4], marginRight: spacing[4]},
  '.smarty-my-l': {marginTop: spacing[4], marginBottom: spacing[4]},

  // XL: 24px
  '.smarty-m-xl': {margin: spacing[6]},
  '.smarty-mt-xl': {marginTop: spacing[6]},
  '.smarty-mr-xl': {marginRight: spacing[6]},
  '.smarty-mb-xl': {marginBottom: spacing[6]},
  '.smarty-ml-xl': {marginLeft: spacing[6]},
  '.smarty-mx-xl': {marginLeft: spacing[6], marginRight: spacing[6]},
  '.smarty-my-xl': {marginTop: spacing[6], marginBottom: spacing[6]},

  // 2XL: 32px
  '.smarty-m-2xl': {margin: spacing[8]},
  '.smarty-mt-2xl': {marginTop: spacing[8]},
  '.smarty-mr-2xl': {marginRight: spacing[8]},
  '.smarty-mb-2xl': {marginBottom: spacing[8]},
  '.smarty-ml-2xl': {marginLeft: spacing[8]},
  '.smarty-mx-2xl': {marginLeft: spacing[8], marginRight: spacing[8]},
  '.smarty-my-2xl': {marginTop: spacing[8], marginBottom: spacing[8]},

  // 3XL: 64px
  '.smarty-m-3xl': {margin: spacing[16]},
  '.smarty-mt-3xl': {marginTop: spacing[16]},
  '.smarty-mr-3xl': {marginRight: spacing[16]},
  '.smarty-mb-3xl': {marginBottom: spacing[16]},
  '.smarty-ml-3xl': {marginLeft: spacing[16]},
  '.smarty-mx-3xl': {marginLeft: spacing[16], marginRight: spacing[16]},
  '.smarty-my-3xl': {marginTop: spacing[16], marginBottom: spacing[16]},

  // ===========================
  // GAP UTILITIES
  // Figma Design System - Semantic Sizes
  // ===========================
  // XS: 2px
  '.smarty-gap-xs': {gap: spacing[0.5]},
  '.smarty-gap-x-xs': {columnGap: spacing[0.5]},
  '.smarty-gap-y-xs': {rowGap: spacing[0.5]},

  // S: 4px
  '.smarty-gap-s': {gap: spacing[1]},
  '.smarty-gap-x-s': {columnGap: spacing[1]},
  '.smarty-gap-y-s': {rowGap: spacing[1]},

  // M: 8px
  '.smarty-gap-m': {gap: spacing[2]},
  '.smarty-gap-x-m': {columnGap: spacing[2]},
  '.smarty-gap-y-m': {rowGap: spacing[2]},

  // L: 12px
  '.smarty-gap-l': {gap: spacing[3]},
  '.smarty-gap-x-l': {columnGap: spacing[3]},
  '.smarty-gap-y-l': {rowGap: spacing[3]},

  // XL: 16px
  '.smarty-gap-xl': {gap: spacing[4]},
  '.smarty-gap-x-xl': {columnGap: spacing[4]},
  '.smarty-gap-y-xl': {rowGap: spacing[4]},

  // 2XL: 24px
  '.smarty-gap-2xl': {gap: spacing[6]},
  '.smarty-gap-x-2xl': {columnGap: spacing[6]},
  '.smarty-gap-y-2xl': {rowGap: spacing[6]},

  // 3XL: 48px
  '.smarty-gap-3xl': {gap: spacing[12]},
  '.smarty-gap-x-3xl': {columnGap: spacing[12]},
  '.smarty-gap-y-3xl': {rowGap: spacing[12]},
} as const;

/**
 * Negative versions of the margin utilities above, such as `-smarty-mt-2xl`,
 * for pulling an element over the one before it. Built from the margin entries
 * so the two scales cannot drift apart.
 */
export const negativeMarginUtilities = Object.fromEntries(
  Object.entries(spacingUtilities)
    .filter(([selector]) => /^\.smarty-m[trblxy]?-/.test(selector))
    .map(([selector, declarations]) => [
      selector.replace('.', '.-'),
      Object.fromEntries(
        Object.entries(declarations).map(([property, value]) => [
          property,
          `-${value}`,
        ]),
      ),
    ]),
) as Record<`.-smarty-m${string}`, Record<string, string>>;

// ===========================
// BORDER RADIUS UTILITIES
// ===========================
// Custom utilities for border radius with semantic sizes
// Figma Design System

export const borderRadiusUtilities = {
  // S: 2px
  '.smarty-rounded-s': {borderRadius: spacing[0.5]},
  '.smarty-rounded-t-s': {
    borderTopLeftRadius: spacing[0.5],
    borderTopRightRadius: spacing[0.5],
  },
  '.smarty-rounded-b-s': {
    borderBottomLeftRadius: spacing[0.5],
    borderBottomRightRadius: spacing[0.5],
  },

  // M: 4px
  '.smarty-rounded-m': {borderRadius: spacing[1]},
  '.smarty-rounded-t-m': {
    borderTopLeftRadius: spacing[1],
    borderTopRightRadius: spacing[1],
  },
  '.smarty-rounded-b-m': {
    borderBottomLeftRadius: spacing[1],
    borderBottomRightRadius: spacing[1],
  },

  // L: 8px
  '.smarty-rounded-l': {borderRadius: spacing[2]},
  '.smarty-rounded-t-l': {
    borderTopLeftRadius: spacing[2],
    borderTopRightRadius: spacing[2],
  },
  '.smarty-rounded-b-l': {
    borderBottomLeftRadius: spacing[2],
    borderBottomRightRadius: spacing[2],
  },

  // XL: 16px
  '.smarty-rounded-xl': {borderRadius: spacing[4]},
  '.smarty-rounded-t-xl': {
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
  },
  '.smarty-rounded-b-xl': {
    borderBottomLeftRadius: spacing[4],
    borderBottomRightRadius: spacing[4],
  },

  // 2XL: 32px
  '.smarty-rounded-2xl': {borderRadius: spacing[8]},
  '.smarty-rounded-t-2xl': {
    borderTopLeftRadius: spacing[8],
    borderTopRightRadius: spacing[8],
  },
  '.smarty-rounded-b-2xl': {
    borderBottomLeftRadius: spacing[8],
    borderBottomRightRadius: spacing[8],
  },

  // Focus: 12px
  '.smarty-rounded-focus': {borderRadius: spacing[3]},
  '.smarty-rounded-t-focus': {
    borderTopLeftRadius: spacing[3],
    borderTopRightRadius: spacing[3],
  },
  '.smarty-rounded-b-focus': {
    borderBottomLeftRadius: spacing[3],
    borderBottomRightRadius: spacing[3],
  },

  // Full: 9999px
  '.smarty-rounded-full': {borderRadius: '9999px'},
} as const;
