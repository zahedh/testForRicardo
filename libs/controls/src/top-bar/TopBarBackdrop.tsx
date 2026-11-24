import MaskedView from '@react-native-masked-view/masked-view';
import {useOnResolveThemeColor, withAlpha} from '@smarty-app/util-generic';
import {BlurView} from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import {useColorScheme} from 'nativewind';
import {JSX} from 'react';
import {ColorValue, Platform, StyleSheet} from 'react-native';

import {
  getTopBarScrimTestID,
  SCRIM_ALPHA_STOPS,
  SCRIM_LOCATIONS,
  TopBarBackdropProps,
} from './SmartyTopBar';

// Strength of the blur where the mask below leaves it fully opaque, on the
// 0-100 expo-blur scale.
const BLUR_INTENSITY = 10;

// The blur cannot be ramped by stacking BlurViews — iOS captures the backdrop
// from the layers beneath an effect view and excludes other effect views, so
// extra layers only stack their materials. Instead a single BlurView is put
// under a gradient alpha mask: the mask's opacity is what survives, so the blur
// itself fades out towards the bottom edge of the bar, the way iOS ramps the
// blur on its own navigation bars. Only the alpha of these colors matters.
const BLUR_MASK_COLORS = [
  'rgba(0,0,0,1)',
  'rgba(0,0,0,1)',
  'rgba(0,0,0,0.6)',
  'rgba(0,0,0,0)',
] as const;
const BLUR_MASK_LOCATIONS = [0, 0.5, 0.8, 1] as const;

/**
 * Translucent backdrop for a top bar: a blur of the content behind it (iOS
 * only) under a scrim that fades the screen background out towards the bar's
 * bottom edge.
 *
 * @param props - The props for the top bar backdrop.
 * @returns The backdrop layers, or null when the backdrop is transparent.
 */
export function TopBarBackdrop(props: TopBarBackdropProps): JSX.Element | null {
  const {config, backgroundColor, transparent = false} = props;

  const onResolveThemeColor = useOnResolveThemeColor();
  const foregroundColor = onResolveThemeColor(backgroundColor);
  const testID = getTopBarScrimTestID(config);

  if (transparent) {
    return null;
  }

  return (
    <>
      <TopBarBlur />
      <LinearGradient
        testID={testID}
        pointerEvents="none"
        colors={toScrimColors(foregroundColor)}
        locations={SCRIM_LOCATIONS}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}

/**
 * Live blur of the screen content passing behind the bar, matching the
 * translucent navigation bars iOS draws for its own apps. iOS only: Android
 * has no equivalent material and falls back to the scrim gradient alone.
 *
 * @returns The blur layer, or null off iOS.
 */
function TopBarBlur(): JSX.Element | null {
  const {colorScheme} = useColorScheme();

  if (Platform.OS !== 'ios') {
    return null;
  }

  const tint =
    colorScheme === 'light'
      ? 'systemUltraThinMaterialLight'
      : 'systemUltraThinMaterialDark';

  return (
    <MaskedView
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      maskElement={
        <LinearGradient
          colors={BLUR_MASK_COLORS}
          locations={BLUR_MASK_LOCATIONS}
          style={StyleSheet.absoluteFill}
        />
      }>
      <BlurView
        tint={tint}
        intensity={BLUR_INTENSITY}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
}

/**
 * Applies {@link SCRIM_ALPHA_STOPS} to the bar's tint color.
 *
 * @param color - The `#rrggbb` color the scrim fades out from.
 * @returns The gradient stops, as the 2-or-more tuple LinearGradient expects.
 */
function toScrimColors(
  color: string,
): readonly [ColorValue, ColorValue, ...ColorValue[]] {
  const [first, second, ...rest] = SCRIM_ALPHA_STOPS.map((alpha) =>
    withAlpha(color, alpha),
  );
  return [first, second, ...rest];
}
