import {core} from '@smarty-app/design-tokens';
import {GlassView, isGlassEffectAPIAvailable} from 'expo-glass-effect';
import {JSX} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {cn} from '../classNameUtil';

// Teal tint pulled from the design tokens to match the brand glass look.
const GLASS_TINT_COLOR = core.brand.teal[800];

const styles = StyleSheet.create({
  // Clips children (notably an Android press ripple, which is bounded only by
  // its own rectangle) to the corner radius. Applied after the caller's style
  // so it overrides any `overflow: 'visible'` meant for the glass path.
  clip: {overflow: 'hidden'},
});

/**
 * The brand's glass surface: teal-tinted liquid glass where available (iOS 26+),
 * and a flat teal fill elsewhere (older iOS and Android). GlassView is a native
 * component and does not support NativeWind `className`, so callers pass the
 * shape (size, corner radius) as a `style`.
 *
 * @param props - React Native View props.
 * @returns The TealGlassView component.
 */
export function TealGlassView(props: ViewProps): JSX.Element {
  const {className} = props;
  // Liquid glass needs iOS 26+. On older iOS GlassView renders fully transparent
  // (no tint, no corner radius), and on Android it doesn't exist at all.
  return isGlassEffectAPIAvailable() ? (
    <View className={className}>
      <GlassView
        glassEffectStyle="regular"
        colorScheme="light"
        tintColor={GLASS_TINT_COLOR}
        isInteractive
        style={props.style}>
        {props.children}
      </GlassView>
    </View>
  ) : (
    // Clip to the rounded shape so a child's press feedback (e.g. an android_ripple, which is square)
    // doesn't show past the corners.
    <View
      style={[props.style, styles.clip]}
      className={cn('bg-brand-teal-800', className)}>
      {props.children}
    </View>
  );
}
