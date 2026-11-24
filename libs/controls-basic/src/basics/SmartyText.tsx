import {getVoiceOverPronunciation} from '@smarty-app/language';
import {useScaledFontSize} from '@smarty-app/util-generic';
import React, {JSX} from 'react';
import {Text, TextProps} from 'react-native';

import {cn} from '../classNameUtil';

type SmartyTextProps = TextProps & {
  /** Pass `false` to turn off the device font scale applied here. */
  allowFontScaling?: boolean;
  /** Caps the font scale. Defaults to the cap derived from the size class. */
  maxFontSizeMultiplier?: number;
  /** Positive multiple of the font size (`1` makes line height equal font size). */
  lineHeight?: number;
};

/**
 * Native text component. Wraps React Native `Text` and applies the `smarty-*` size class's design
 * token font size and line height, scaled by the device font scale (capped by
 * `maxFontSizeMultiplier` or the default maximum).
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
      allowFontScaling,
      maxFontSizeMultiplier,
      lineHeight,
      ...rest
    } = props;

    const {maxScale, style: mergedStyle} = useScaledFontSize({
      allowFontScaling,
      className,
      lineHeight,
      maxFontSizeMultiplier,
      style,
    });

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
        style={mergedStyle}
        allowFontScaling={
          allowFontScaling !== undefined ? allowFontScaling : false
        }
        maxFontSizeMultiplier={
          maxFontSizeMultiplier !== undefined ? maxFontSizeMultiplier : maxScale
        }
        accessibilityLabel={effectiveAccessibilityLabel}
        {...rest}>
        {children}
      </Text>
    );
  },
);

SmartyText.displayName = 'SmartyText';
