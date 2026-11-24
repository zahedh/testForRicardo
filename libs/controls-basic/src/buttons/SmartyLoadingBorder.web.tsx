import {core} from '@smarty-app/design-tokens';
import {getSmartyRadius} from '@smarty-app/util-generic';
import {JSX, useMemo} from 'react';

import {getSmartyLoadingBorderGeometry} from './smartyLoadingBorderHooks';

/**
 * Web implementation of the animated loading border.
 *
 * The native implementation uses React Native's `Animated` API together with
 * `react-native-svg`, neither of which drives animations natively on web. To
 * match the native animation 1:1, this version reuses the identical geometry
 * and timing (a 28% dash segment traveling the perimeter over 1200ms, linear,
 * looping forever) but animates `stroke-dashoffset` via CSS keyframes. Its
 * corner radius defaults to the `smarty-rounded-l` token used by the buttons.
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
  const color = core.brand.teal[800];
  const strokeWidth = 2;

  const {drawnWidth, drawnHeight, radius, perimeter, segmentLength} =
    getSmartyLoadingBorderGeometry(width, height, borderRadius, strokeWidth);

  // Unique keyframes name so multiple borders with different perimeters can
  // animate independently on the same page.
  const animationName = useMemo(
    () => `smarty-loading-border-${Math.round(perimeter)}`,
    [perimeter],
  );

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <svg
      pointerEvents="none"
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0}}>
      <style>
        {`@keyframes ${animationName} {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -${perimeter}; }
          }`}
      </style>
      <rect
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
        style={{
          animation: `${animationName} 1200ms linear infinite`,
        }}
      />
    </svg>
  );
}
