#!/usr/bin/env ts-node

/**
 * Generate theme.css from colors.ts
 *
 * This script reads the color tokens from colors.ts and generates
 * the theme.css file with CSS custom properties for both light and dark themes.
 */

import * as fs from 'fs';
import * as path from 'path';

import {core, semantic} from '../libs/design-tokens/src/tokens/colors';

/**
 * Generates CSS custom property declarations for core colors
 *
 * @returns String containing CSS custom property declarations
 */
function generateCoreColorsCss(): string {
  const lines: string[] = [];

  // Brand colors
  lines.push('  /* Core Brand Colors */');
  lines.push(`  --color-brand-slate-800: ${core.brand.slate[800]};`);
  lines.push(`  --color-brand-teal-100: ${core.brand.teal[100]};`);
  lines.push(`  --color-brand-teal-800: ${core.brand.teal[800]};`);
  lines.push(`  --color-brand-white-0: ${core.brand.white[0]};`);
  lines.push(`  --color-brand-blue-100: ${core.brand.blue[100]};`);
  lines.push(`  --color-brand-blue-800: ${core.brand.blue[800]};`);
  lines.push(`  --color-brand-pink-100: ${core.brand.pink[100]};`);
  lines.push(`  --color-brand-pink-800: ${core.brand.pink[800]};`);
  lines.push(`  --color-brand-purple-100: ${core.brand.purple[100]};`);
  lines.push(`  --color-brand-purple-800: ${core.brand.purple[800]};`);
  lines.push('');

  // Accent colors
  lines.push('  /* Core Accent Palette Colors */');
  lines.push(`  --color-accent-teal-850: ${core.accent.teal[850]};`);
  lines.push(`  --color-accent-teal-900: ${core.accent.teal[900]};`);
  lines.push(`  --color-accent-slate-100: ${core.accent.slate[100]};`);
  lines.push(`  --color-accent-slate-200: ${core.accent.slate[200]};`);
  lines.push(`  --color-accent-slate-600: ${core.accent.slate[600]};`);
  lines.push(`  --color-accent-slate-700: ${core.accent.slate[700]};`);
  lines.push(`  --color-accent-slate-900: ${core.accent.slate[900]};`);
  lines.push(`  --color-accent-yellow-100: ${core.accent.yellow[100]};`);
  lines.push(`  --color-accent-yellow-800: ${core.accent.yellow[800]};`);
  lines.push(`  --color-accent-wave-100: ${core.accent.wave[100]};`);
  lines.push(`  --color-accent-wave-800: ${core.accent.wave[800]};`);
  lines.push(`  --color-accent-aqua-100: ${core.accent.aqua[100]};`);
  lines.push(`  --color-accent-aqua-800: ${core.accent.aqua[800]};`);
  lines.push(`  --color-accent-cornflour-100: ${core.accent.cornflour[100]};`);
  lines.push(`  --color-accent-cornflour-800: ${core.accent.cornflour[800]};`);
  lines.push(`  --color-accent-ocean-100: ${core.accent.ocean[100]};`);
  lines.push(`  --color-accent-ocean-800: ${core.accent.ocean[800]};`);
  lines.push(`  --color-accent-iceberg-100: ${core.accent.iceberg[100]};`);
  lines.push(`  --color-accent-iceberg-800: ${core.accent.iceberg[800]};`);
  lines.push(`  --color-accent-sky-100: ${core.accent.sky[100]};`);
  lines.push(`  --color-accent-sky-800: ${core.accent.sky[800]};`);
  lines.push(
    `  --color-accent-sandcastle-100: ${core.accent.sandcastle[100]};`,
  );
  lines.push(
    `  --color-accent-sandcastle-800: ${core.accent.sandcastle[800]};`,
  );
  lines.push(`  --color-accent-peach-100: ${core.accent.peach[100]};`);
  lines.push(`  --color-accent-peach-800: ${core.accent.peach[800]};`);
  lines.push(`  --color-accent-peony-100: ${core.accent.peony[100]};`);
  lines.push(`  --color-accent-peony-800: ${core.accent.peony[800]};`);
  lines.push(`  --color-accent-rose-100: ${core.accent.rose[100]};`);
  lines.push(`  --color-accent-rose-800: ${core.accent.rose[800]};`);
  lines.push(`  --color-accent-petal-100: ${core.accent.petal[100]};`);
  lines.push(`  --color-accent-petal-800: ${core.accent.petal[800]};`);
  lines.push(`  --color-accent-lavander-100: ${core.accent.lavander[100]};`);
  lines.push(`  --color-accent-lavander-800: ${core.accent.lavander[800]};`);
  lines.push(`  --color-accent-lilac-100: ${core.accent.lilac[100]};`);
  lines.push(`  --color-accent-lilac-800: ${core.accent.lilac[800]};`);
  lines.push(`  --color-accent-jade-100: ${core.accent.jade[100]};`);
  lines.push(`  --color-accent-jade-800: ${core.accent.jade[800]};`);
  lines.push(`  --color-accent-sage-100: ${core.accent.sage[100]};`);
  lines.push(`  --color-accent-sage-800: ${core.accent.sage[800]};`);
  lines.push(`  --color-accent-olive-100: ${core.accent.olive[100]};`);
  lines.push(`  --color-accent-olive-800: ${core.accent.olive[800]};`);
  lines.push(`  --color-accent-pistachio-100: ${core.accent.pistachio[100]};`);
  lines.push(`  --color-accent-pistachio-800: ${core.accent.pistachio[800]};`);
  lines.push(`  --color-accent-lime-100: ${core.accent.lime[100]};`);
  lines.push(`  --color-accent-lime-800: ${core.accent.lime[800]};`);
  lines.push(`  --color-accent-leaf-100: ${core.accent.leaf[100]};`);
  lines.push(`  --color-accent-leaf-800: ${core.accent.leaf[800]};`);
  lines.push(`  --color-accent-mandarine-100: ${core.accent.mandarine[100]};`);
  lines.push(`  --color-accent-mandarine-800: ${core.accent.mandarine[800]};`);
  lines.push(`  --color-accent-coral-100: ${core.accent.coral[100]};`);
  lines.push(`  --color-accent-coral-800: ${core.accent.coral[800]};`);
  lines.push(`  --color-accent-red-100: ${core.accent.red[100]};`);
  lines.push(`  --color-accent-red-800: ${core.accent.red[800]};`);

  return lines.join('\n');
}

/**
 * Generates CSS custom property declarations for semantic colors (light theme)
 *
 * @returns String containing CSS custom property declarations
 */
function generateLightSemanticColorsCss(): string {
  const lines: string[] = [];

  // Foreground
  lines.push('  /* Semantic Colors - Foreground */');
  lines.push(
    `  --color-foreground-primary: ${semantic.foreground.primary.light};`,
  );
  lines.push(
    `  --color-foreground-secondary: ${semantic.foreground.secondary.light};`,
  );
  lines.push(
    `  --color-foreground-tertiary: ${semantic.foreground.tertiary.light};`,
  );
  lines.push(
    `  --color-foreground-accent: ${semantic.foreground.accent.light};`,
  );
  lines.push(
    `  --color-foreground-warning: ${semantic.foreground.warning.light};`,
  );
  lines.push(`  --color-foreground-promo: ${semantic.foreground.promo.light};`);
  lines.push('');

  // Background
  lines.push('  /* Semantic Colors - Background */');
  lines.push(
    `  --color-background-primary: ${semantic.background.primary.light};`,
  );
  lines.push(
    `  --color-background-secondary: ${semantic.background.secondary.light};`,
  );
  lines.push(
    `  --color-background-tertiary: ${semantic.background.tertiary.light};`,
  );
  lines.push(
    `  --color-background-accent: ${semantic.background.accent.light};`,
  );
  lines.push(`  --color-background-promo: ${semantic.background.promo.light};`);
  lines.push('');

  // Stroke
  lines.push('  /* Semantic Colors - Stroke */');
  lines.push(`  --color-stroke-strong: ${semantic.stroke.strong.light};`);
  lines.push(`  --color-stroke-medium: ${semantic.stroke.medium.light};`);
  lines.push('');

  // Overlay
  lines.push('  /* Semantic Colors - Overlay */');
  lines.push(`  --color-overlay-modal: ${semantic.overlay.modal.light};`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Generates CSS custom property declarations for semantic colors (dark theme)
 *
 * @returns String containing CSS custom property declarations
 */
function generateDarkSemanticColorsCss(): string {
  const lines: string[] = [];

  // Foreground
  lines.push('  /* Semantic Colors - Foreground */');
  lines.push(
    `  --color-foreground-primary: ${semantic.foreground.primary.dark};`,
  );
  lines.push(
    `  --color-foreground-secondary: ${semantic.foreground.secondary.dark};`,
  );
  lines.push(
    `  --color-foreground-tertiary: ${semantic.foreground.tertiary.dark};`,
  );
  lines.push(
    `  --color-foreground-accent: ${semantic.foreground.accent.dark};`,
  );
  lines.push(
    `  --color-foreground-warning: ${semantic.foreground.warning.dark};`,
  );
  lines.push(`  --color-foreground-promo: ${semantic.foreground.promo.dark};`);
  lines.push('');

  // Background
  lines.push('  /* Semantic Colors - Background */');
  lines.push(
    `  --color-background-primary: ${semantic.background.primary.dark};`,
  );
  lines.push(
    `  --color-background-secondary: ${semantic.background.secondary.dark};`,
  );
  lines.push(
    `  --color-background-tertiary: ${semantic.background.tertiary.dark};`,
  );
  lines.push(
    `  --color-background-accent: ${semantic.background.accent.dark};`,
  );
  lines.push(`  --color-background-promo: ${semantic.background.promo.dark};`);
  lines.push('');

  // Stroke
  lines.push('  /* Semantic Colors - Stroke */');
  lines.push(`  --color-stroke-strong: ${semantic.stroke.strong.dark};`);
  lines.push(`  --color-stroke-medium: ${semantic.stroke.medium.dark};`);
  lines.push('');

  // Overlay
  lines.push('  /* Semantic Colors - Overlay */');
  lines.push(`  --color-overlay-modal: ${semantic.overlay.modal.dark};`);

  return lines.join('\n');
}

/**
 * Generates the complete theme.css file content
 *
 * @returns Complete CSS file content as a string
 */
function generateThemeCss(): string {
  const lightSemanticColors = generateLightSemanticColorsCss();
  const coreColors = generateCoreColorsCss();
  const darkSemanticColors = generateDarkSemanticColorsCss();

  return `/**
 * Theme CSS Variables
 *
 * This file defines CSS custom properties for colors that change based on theme.
 * Light theme is defined in :root, dark theme in .dark selector.
 
 * ⚠️ AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * This file is generated from colors.ts using scripts/generate-theme-css.ts
 * To update, modify colors.ts and run: npm run generate:theme-css
 */

/* ===========================
   LIGHT THEME (Default)
   =========================== */

:root {
${lightSemanticColors}${coreColors}}

/* ===========================
   DARK THEME
   =========================== */

.dark {
${darkSemanticColors}}
`;
}

/**
 * Main execution function
 */
function main() {
  try {
    process.stdout.write('🎨 Generating theme.css from colors.ts...\n');

    const cssContent = generateThemeCss();
    const outputPath = path.join(
      __dirname,
      '../libs/design-tokens/src/tokens/web/theme.css',
    );

    fs.writeFileSync(outputPath, cssContent, 'utf-8');

    process.stdout.write('✅ Successfully generated theme.css\n');
    process.stdout.write(`📍 Output: ${outputPath}\n`);
  } catch (error) {
    console.error('❌ Error generating theme.css:', error);
    process.exit(1);
  }
}

main();
