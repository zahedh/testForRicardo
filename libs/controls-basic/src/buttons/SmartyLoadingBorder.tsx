import {core} from '@smarty-app/design-tokens';
import {getSmartyRadius} from '@smarty-app/util-generic';
import {JSX, useEffect} from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Rect, Svg} from 'react-native-svg';

import {getSmartyLoadingBorderGeometry} from './smartyLoadingBorderHooks';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

/**
 * An animated slim border that travels endlessly around the perimeter of its
 * parent, used to indicate a loading state on a button. Its corner radius
 * defaults to the `smarty-rounded-l` token used by the buttons.
 *
 * The animation runs on the UI thread, so it keeps moving while the JS thread
 * is busy, such as while the save it indicates is settling.
 *
 * @param props - Border props.
 * @param props.width - Measured width of the parent, in pixels.
 * @param props.height - Measured height of the parent, in pixels.
 * @param props.borderRadius - Corner radius of the parent, in pixels. Defaults to `smarty-rounded-l`.
 * @returns A React element, or `null` until the parent has been measured.
 */
export function SmartyLoadingBorder({
  width,
  height,
  borderRadius = getSmartyRadius('.smarty-rounded-l'),
}: {
  width: number;
  height: number;
  borderRadius?: number;
}): JSX.Element | null {
  const progress = useSharedValue(0);
  const color = core.brand.teal[800];
  const strokeWidth = 2;
  const {drawnWidth, drawnHeight, radius, perimeter, segmentLength} =
    getSmartyLoadingBorderGeometry(width, height, borderRadius, strokeWidth);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1200, easing: Easing.linear}),
      -1,
    );
    return () => cancelAnimation(progress);
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -progress.value * perimeter,
  }));

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0}}>
      <AnimatedRect
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={drawnWidth}
        height={drawnHeight}
        rx={radius}
        ry={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${segmentLength} ${Math.max(
          perimeter - segmentLength,
          0,
        )}`}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
