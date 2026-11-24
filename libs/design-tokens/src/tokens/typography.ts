/**
 * Typography Tokens
 *
 * This file defines typography-related tokens including font families and semantic typography.
 * Matches Figma's typography system with categories: heading, body, caption, and cta.
 */

// ===========================
// FONT FAMILIES
// ===========================

export const fontFamily = {
  theme: ['Kollektif', 'system-ui', 'sans-serif'],
  'theme-bold': ['Kollektif-Bold', 'Kollektif', 'system-ui', 'sans-serif'],
  'theme-italic': ['Kollektif-Italic', 'Kollektif', 'system-ui', 'sans-serif'],
  'theme-bold-italic': [
    'Kollektif-BoldItalic',
    'Kollektif',
    'system-ui',
    'sans-serif',
  ],
  // Placeholder for future font families (e.g., serif, mono)
  sans: [],
  mono: [],
} as const;

// ===========================
// TYPOGRAPHY UTILITIES
// ===========================
// Semantic typography utilities aligned with Figma Design System

export const typographyUtilities = {
  // Heading utilities
  '.smarty-heading-xs': {
    fontSize: '1.5rem',
    lineHeight: '1.8rem',
    fontWeight: '600',
  },

  '.smarty-heading-s': {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: '600',
  },

  '.smarty-heading-m': {
    fontSize: '2.25rem',
    lineHeight: '2.7rem',
    fontWeight: '600',
  },

  '.smarty-heading-l': {
    fontSize: '3rem',
    lineHeight: '3.6rem',
    fontWeight: '600',
  },

  '.smarty-heading-xl': {
    fontSize: '4rem',
    lineHeight: '4.8rem',
    fontWeight: '600',
  },

  // Body utilities
  '.smarty-body-m': {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: '400',
  },
  '.smarty-body-l': {
    fontSize: '1.125rem',
    lineHeight: '1.6875rem',
    fontWeight: '400',
  },

  // Caption utilities
  '.smarty-caption-m': {
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
    fontWeight: '400',
  },
  '.smarty-caption-l': {
    fontSize: '0.875rem',
    lineHeight: '1.3125rem',
    fontWeight: '400',
  },

  // CTA utilities
  '.smarty-cta-s': {
    fontSize: '0.875rem',
    lineHeight: '0.875rem',
    fontWeight: '600',
  },
  '.smarty-cta-m': {
    fontSize: '1rem',
    lineHeight: '1rem',
    fontWeight: '600',
  },
  '.smarty-cta-l': {
    fontSize: '1.125rem',
    lineHeight: '1.125rem',
    fontWeight: '600',
  },
} as const;

/**
 * Legacy typography shortcuts
 * These map custom class names to Tailwind utility combinations that were previously used in the SM2 codebase.
 * Keep in mind these were only intended for mobile screens.
 * NOT IMPORTED INTO TAILWIND CONFIG - only for reference.
 */
export const legacyTypographyShortcuts = {
  'smarty-text-xs': 'text-xs sm:text-[0.5rem] leading-[0.75rem]',
  'smarty-text-sm': 'text-sm sm:text-xs md:text-base',
  'smarty-text-base': 'text-base sm:text-sm md:text-lg',
  'smarty-text-lg': 'text-lg sm:text-base md:text-xl',
  'smarty-text-xl': 'text-xl sm:text-lg md:text-2xl',
  'smarty-text-2xl': 'text-2xl sm:text-xl md:text-3xl',
  'smarty-text-3xl': 'text-3xl sm:text-2xl md:text-4xl',
  'smarty-text-4xl': 'text-4xl sm:text-3xl md:text-5xl',
  'smarty-text-5xl': 'text-5xl sm:text-4xl md:text-6xl',
} as const;
