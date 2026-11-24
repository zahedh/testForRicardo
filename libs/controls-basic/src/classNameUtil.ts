/* eslint-disable @typescript-eslint/no-explicit-any */
import {ClassValue, clsx} from 'clsx';
import {useCallback} from 'react';
import {extendTailwindMerge} from 'tailwind-merge';

/**
 * Custom tailwind-merge configuration that understands our custom Smarty utilities.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // ===========================
      // TYPOGRAPHY
      // All of these set fontSize + lineHeight, so they all conflict with each other.
      // ===========================
      'font-size': [
        {'smarty-heading': ['xs', 's', 'm', 'l', 'xl']},
        {'smarty-body': ['m', 'l']},
        {'smarty-caption': ['m', 'l']},
        {'smarty-cta': ['s', 'm', 'l']},
      ],

      // ===========================
      // SPACING - PADDING
      // ===========================
      p: [{'smarty-p': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      pt: [{'smarty-pt': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      pr: [{'smarty-pr': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      pb: [{'smarty-pb': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      pl: [{'smarty-pl': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      px: [{'smarty-px': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      py: [{'smarty-py': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],

      // ===========================
      // SPACING - MARGIN
      // ===========================
      m: [{'smarty-m': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      mt: [{'smarty-mt': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      mr: [{'smarty-mr': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      mb: [{'smarty-mb': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      ml: [{'smarty-ml': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      mx: [{'smarty-mx': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      my: [{'smarty-my': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],

      // ===========================
      // SPACING - GAP
      // ===========================
      gap: [{'smarty-gap': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      'gap-x': [{'smarty-gap-x': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],
      'gap-y': [{'smarty-gap-y': ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']}],

      // ===========================
      // BORDER RADIUS
      // ===========================
      rounded: [{'smarty-rounded': ['s', 'm', 'l', 'xl', '2xl', 'focus']}],
      'rounded-t': [
        {'smarty-rounded-t': ['s', 'm', 'l', 'xl', '2xl', 'focus']},
      ],
      'rounded-b': [
        {'smarty-rounded-b': ['s', 'm', 'l', 'xl', '2xl', 'focus']},
      ],
    },
  },
});

/**
 * Utility function for merging className strings.
 *
 * @param {ClassValue[]} inputs Input className values.
 * @returns {string} The final className string.
 */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

interface ColorNameClassToStyleProps {
  className: string;
  style?: any;
}

/**
 * React hook that returns a function to convert Tailwind classNames with embedded hex colors (e.g. bg-[#ff0000]) into inline styles, while preserving the original className for other Tailwind utilities.
 *
 * The returned function takes an object with a className and optional style, extracts any hex color from the className, and returns a new object with the cleaned className and a merged style object that includes the extracted color as an inline style.
 *
 * @returns An object with the cleaned className and merged style.
 *
 * @example
 * const colorNameClassToStyle = useColorNameClassToStyle();
 * const { className, style } = colorNameClassToStyle({ className: 'bg-[#ff0000] text-white p-4', style: { margin: 10 } });
 *
 * // Result: { className: 'text-white p-4', style: { margin: 10, backgroundColor: '#ff0000' } }
 */
export function useColorNameClassToStyle(): (
  props: ColorNameClassToStyleProps,
) => {className: string; style: any} {
  return useCallback((props: ColorNameClassToStyleProps) => {
    const {className, style} = props;
    let newClassName = className;

    const colorRegex = /(bg|text|border)-\[(['`"]?)#([0-9a-fA-F]{6,8})\2\]/g;
    let match;
    const colorStyle: Record<string, string> = {};
    while ((match = colorRegex.exec(className)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [fullMatch, type, _quote, hex] = match;
      const color = `#${hex}`;
      if (type === 'bg') colorStyle.backgroundColor = color;
      if (type === 'text') colorStyle.color = color;
      if (type === 'border') colorStyle.borderColor = color;
      newClassName = newClassName
        .replace(fullMatch, '')
        .replace(/\s{2,}/g, ' ');
    }
    newClassName = newClassName.trim();

    let mergedStyle;
    if (Array.isArray(style)) {
      mergedStyle = [...style, colorStyle];
    } else if (style && typeof style === 'object') {
      mergedStyle = {...style, ...colorStyle};
    } else if (style == null) {
      mergedStyle = Object.keys(colorStyle).length ? colorStyle : undefined;
    } else {
      mergedStyle = style;
    }

    return {
      className: newClassName,
      style: mergedStyle,
    };
  }, []);
}
