import {getVoiceOverPronunciation} from '@smarty-app/language';
import React, {JSX} from 'react';
import {Text, TextProps} from 'react-native';

import {cn} from '../classNameUtil';

type SmartyTextProps = TextProps & {
  /** Accepted so callers can share props across platforms; a no-op on web. */
  allowFontScaling?: boolean;
  /** Accepted so callers can share props across platforms; a no-op on web. */
  maxFontSizeMultiplier?: number;
  /** Positive multiple of the font size (`1` makes line height equal font size). */
  lineHeight?: number;
};

/**
 * Web text component. Wraps React Native Web `Text`, with font size and line height coming from
 * the `smarty-*` size class's design token through Tailwind. The default class is `smarty-body-m`.
 *
 * @param props - Text props plus `allowFontScaling`, `maxFontSizeMultiplier` and `lineHeight`.
 * @param ref - Ref to the underlying `Text`.
 * @returns The text element.
 */
export const SmartyText = React.forwardRef(
  (props: SmartyTextProps, ref: React.ForwardedRef<Text>): JSX.Element => {
    const {
      className = '',
      style,
      children,
      accessibilityLabel,
      // allowFontScaling and maxFontSizeMultiplier are no-ops on web; they are
      // pulled out here so they are not spread onto the DOM element.
      allowFontScaling: _allowFontScaling,
      maxFontSizeMultiplier: _maxFontSizeMultiplier,
      lineHeight,
      ...rest
    } = props;

    // RN Web appends 'px' to numeric lineHeight; a string stays a unitless
    // multiplier of the font size (the type says number, hence the cast).
    const unitlessLineHeight =
      lineHeight !== undefined && lineHeight > 0
        ? {lineHeight: `${lineHeight}` as unknown as number}
        : undefined;

    const pronunciation =
      !accessibilityLabel && typeof children === 'string'
        ? getVoiceOverPronunciation(children)
        : undefined;

    const effectiveAccessibilityLabel = pronunciation ?? accessibilityLabel;

    return (
      <Text
        ref={ref}
        className={cn(
          'font-theme smarty-body-m text-foreground-primary',
          className,
        )}
        style={[style, unitlessLineHeight]}
        accessibilityLabel={effectiveAccessibilityLabel}
        {...rest}>
        {children}
      </Text>
    );
  },
);

SmartyText.displayName = 'SmartyText';
