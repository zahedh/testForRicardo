import {useOnResolveThemeColor} from '@smarty-app/util-generic';
import {JSX} from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

import {isTopBarConfigModal} from './hooks/topBarCommonHooks';
import {
  getTopBarScrimTestID,
  SCRIM_ALPHA_STOPS,
  SCRIM_LOCATIONS,
  TopBarBackdropProps,
} from './SmartyTopBar';

/**
/**
 * The web counterpart of the native bar's scrim: the gradient that fades the
 * background out from the top of the bar down to its bottom edge, so content
 * passing behind a floating bar dissolves before it reaches the bar's controls.
 *
 * Drawn with `react-native-svg` rather than the `expo-linear-gradient` the
 * native bar uses, because the web bundle deliberately carries no expo modules.
 *
 * @param props - The props for the top bar backdrop.
 * @returns Nothing.
 */
export function TopBarBackdrop(props: TopBarBackdropProps): JSX.Element | null {
  const {config, backgroundColor, transparent = false} = props;

  const onResolveThemeColor = useOnResolveThemeColor();
  const foregroundColor = onResolveThemeColor(backgroundColor);

  if (transparent || !isTopBarConfigModal(config)) {
    return null; // Only modals use scrim on web.
  }

  const testID = getTopBarScrimTestID(config);
  // Gradients are referenced by id, so two bars on the page (a sheet over a
  // screen) would otherwise share whichever definition rendered first.
  const gradientID = `${testID}-gradient`;

  return (
    <Svg
      testID={testID}
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      pointerEvents="none">
      <Defs>
        <LinearGradient id={gradientID} x1="0" y1="0" x2="0" y2="1">
          {SCRIM_ALPHA_STOPS.map((alpha, index) => (
            <Stop
              key={index}
              offset={SCRIM_LOCATIONS[index]}
              stopColor={foregroundColor}
              stopOpacity={alpha}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`url(#${gradientID})`}
      />
    </Svg>
  );
}
