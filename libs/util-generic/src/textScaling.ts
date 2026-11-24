import {typographyUtilities} from '@smarty-app/design-tokens';
import {StyleProp, TextStyle, useWindowDimensions} from 'react-native';

import {DEFAULT_MAX_FONT_SIZE_MULTIPLIER} from './accessibilityConstants';
import {remToPx} from './tailwindSizeResolver';

function getFontSizeFromClassName(className: string): {
  px?: number;
  lineHeightRatio?: number;
  maxScale?: number;
} {
  const classes = className.split(' ');
  // Run through array backwards so that we use the last font found.
  for (let i = classes.length - 1; i >= 0; i--) {
    const c = classes[i];
    // typographyUtilities keys include the '.' prefix
    const key = c.startsWith('.') ? c : `.${c}`;
    const entry = typographyUtilities[key as keyof typeof typographyUtilities];
    if (entry && 'fontSize' in entry) {
      const px = remToPx(entry.fontSize as string);
      const lineHeightPx =
        'lineHeight' in entry ? remToPx(entry.lineHeight as string) : NaN;
      return {
        px,
        lineHeightRatio: lineHeightPx > 0 ? lineHeightPx / px : undefined,
        maxScale: DEFAULT_MAX_FONT_SIZE_MULTIPLIER, // Always return default max scale for now.
      };
    }
  }
  return {};
}

function flattenTextStyle(style?: StyleProp<TextStyle>): TextStyle {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }

  return (style as TextStyle | undefined) ?? {};
}

export interface ResolveTextScalingProps {
  /** Whether accessibility font scaling is enabled */
  allowFontScaling?: boolean;
  /** NativeWind/Tailwind classes used to infer the base font size */
  className?: string;
  /** Positive multiple of the font size (`1` makes line height equal font size). */
  lineHeight?: number;
  /** Explicit max font scale override */
  maxFontSizeMultiplier?: number;
  /** Existing text style to merge with scaled font metrics */
  style?: StyleProp<TextStyle>;
}

export interface ResolveTextScalingResult {
  /** Default maxScale derived from the font-size class, if present */
  maxScale?: number;
  /** Style merged with scaled fontSize and lineHeight when a size class exists */
  style: TextStyle;
}

/**
 * Resolve a font-size utility class (e.g. `smarty-body-m`) to a px font size and
 * line height that respect the device font scale.
 *
 * @param options - Options controlling font scaling behavior
 * @returns The scaled font size, line height, and matched maxScale
 */
export function useScaledFontSize(
  options: ResolveTextScalingProps = {},
): ResolveTextScalingResult {
  const {fontScale} = useWindowDimensions();

  return resolveTextScaling(options, fontScale);
}

/**
 * Resolves scaled text metrics from a font-size class so callers can match SmartyText sizing.
 *
 * @param props - Inputs used to derive scaled font size and line height
 * @param fontScale - Current device font scale
 * @returns The merged style and any class-derived max scale
 */
export function resolveTextScaling(
  props: ResolveTextScalingProps,
  fontScale: number,
): ResolveTextScalingResult {
  const {
    allowFontScaling,
    className = '',
    lineHeight,
    maxFontSizeMultiplier,
    style,
  } = props;

  const mergedStyle = flattenTextStyle(style);
  const {
    px: baseFontSize,
    lineHeightRatio,
    maxScale,
  } = getFontSizeFromClassName(className);

  let scale = fontScale;
  if (allowFontScaling === false) {
    scale = 1;
  } else if (
    maxFontSizeMultiplier !== undefined &&
    fontScale > maxFontSizeMultiplier
  ) {
    scale = maxFontSizeMultiplier;
  } else if (maxScale !== undefined && fontScale > maxScale) {
    scale = maxScale;
  }

  const scaledFontSize = baseFontSize ? baseFontSize * scale : undefined;
  const lineHeightMultiplier =
    lineHeight !== undefined && lineHeight > 0 ? lineHeight : lineHeightRatio;
  const scaledLineHeight =
    scaledFontSize && lineHeightMultiplier
      ? scaledFontSize * lineHeightMultiplier
      : undefined;

  return {
    maxScale,
    style: {
      ...mergedStyle,
      ...(scaledFontSize ? {fontSize: scaledFontSize} : {}),
      ...(scaledLineHeight ? {lineHeight: scaledLineHeight} : {}),
    },
  };
}
