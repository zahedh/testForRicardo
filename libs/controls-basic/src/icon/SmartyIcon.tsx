import {semantic} from '@smarty-app/design-tokens';
import {useOnResolveThemeColor} from '@smarty-app/util-generic';
import type {LucideIcon} from 'lucide-react-native';
import {ComponentType, JSX} from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';

/** Icon sizes in pixels, matching the Figma Icon Size variable (spacing 4/6/8/10/20). */
export enum SmartyIconSize {
  Small = 16,
  Medium = 24,
  Large = 32,
  XLarge = 40,
  Huge = 80,
}

/** Stroke width in pixels for each size, from Figma. */
const STROKE_WIDTH: Record<SmartyIconSize, number> = {
  [SmartyIconSize.Small]: 1.5,
  [SmartyIconSize.Medium]: 2,
  [SmartyIconSize.Large]: 2,
  [SmartyIconSize.XLarge]: 3,
  [SmartyIconSize.Huge]: 4,
};

/** Lucide icons use a 24x24 viewBox, so strokeWidth scales with the icon. Converting to pixels keeps the Figma values accurate. */
const LUCIDE_VIEW_BOX_SIZE = 24;

/**
 * @property {LucideIcon} [icon] - A Lucide icon, e.g. `import {X} from '@smarty-app/assets'`.
 * @property {ComponentType<SvgProps>} [svg] - A custom SVG, used when no `icon` is given.
 * @property {SmartyIconSize | number} size - A standard size, or a custom pixel size. Custom sizes should also pass `strokeWidth`.
 * @property {string} [color] - Defaults to the theme's accent colour.
 * @property {number} [strokeWidth] - Overrides the size's default stroke width, in pixels. Lucide icons only.
 */
export interface SmartyIconProps {
  icon?: LucideIcon;
  svg?: ComponentType<SvgProps>;
  size: SmartyIconSize | number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Creates icons at standard sizes, from either a Lucide icon or a custom SVG.
 *
 * @param props - Component props
 * @returns JSX element
 */
export function SmartyIcon(props: SmartyIconProps): JSX.Element {
  const onResolveThemeColor = useOnResolveThemeColor();
  const {
    icon: Icon,
    svg: Svg,
    size,
    color = onResolveThemeColor(semantic.foreground.accent),
    strokeWidth = STROKE_WIDTH[size as SmartyIconSize] ??
      STROKE_WIDTH[SmartyIconSize.Small],
  } = props;
  return (
    <View className="items-center justify-center">
      {Icon ? (
        <Icon
          color={color}
          width={size}
          height={size}
          strokeWidth={(strokeWidth * LUCIDE_VIEW_BOX_SIZE) / size}
        />
      ) : (
        Svg && <Svg color={color} width={size} height={size} />
      )}
    </View>
  );
}
