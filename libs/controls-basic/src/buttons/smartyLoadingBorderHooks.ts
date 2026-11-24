/**
 * The resolved geometry of the animated loading border, derived from the
 * measured parent size, corner radius and stroke width.
 */
export interface SmartyLoadingBorderGeometry {
  /** Rect width, inset by half the stroke on each side. */
  drawnWidth: number;
  /** Rect height, inset by half the stroke on each side. */
  drawnHeight: number;
  /** Corner radius, clamped and inset to stay concentric with the parent. */
  radius: number;
  /** Total arc length traveled by the dash. */
  perimeter: number;
  /** Length of the visible moving segment. */
  segmentLength: number;
}

/**
 * Computes the shared geometry for the native and web loading borders so both
 * animate identical shapes. Kept in one place to avoid the two implementations
 * drifting apart.
 *
 * @param width - Measured width of the parent, in pixels.
 * @param height - Measured height of the parent, in pixels.
 * @param borderRadius - Corner radius of the parent, in pixels.
 * @param strokeWidth - Width of the animated stroke, in pixels.
 * @returns The resolved border geometry.
 */
export function getSmartyLoadingBorderGeometry(
  width: number,
  height: number,
  borderRadius: number,
  strokeWidth: number,
): SmartyLoadingBorderGeometry {
  const drawnWidth = Math.max(width - strokeWidth, 0);
  const drawnHeight = Math.max(height - strokeWidth, 0);
  // Shrink the radius by the stroke inset so the animated corners stay
  // concentric with the parent's outer corner.
  const radius = Math.max(
    Math.min(borderRadius, width / 2, height / 2) - strokeWidth / 2,
    0,
  );
  // Arc length of a rounded rectangle: the four straight sides minus the
  // 2 * radius each rounded corner trims off (8 * radius total), plus the four
  // quarter-circle corners, which together form one full circle (2 * PI * r).
  const perimeter =
    2 * (drawnWidth + drawnHeight) - 8 * radius + 2 * Math.PI * radius;
  // The visible moving segment spans ~28% of the perimeter — long enough to
  // read as a moving arc, short enough to leave a clear gap so the loop is
  // legible. Tuned by eye; adjust to make the indicator longer or shorter.
  const segmentLength = perimeter * 0.28;

  return {drawnWidth, drawnHeight, radius, perimeter, segmentLength};
}
