import {JSX, useEffect, useState} from 'react';
import {View, ViewProps} from 'react-native';

import {cn} from '../classNameUtil';

/**
 * Web implementation of the skeleton loading placeholder.
 *
 * React Native's `Animated` API (used by the native implementation) has no
 * native animated module on web.
 *
 * @param props - Standard {@link ViewProps}.
 * @param props.className - Additional Tailwind classes to merge with the defaults.
 * @param props.testID - Test identifier. Defaults to `smarty-skeleton-loading`.
 * @returns A React element rendering the pulsing skeleton placeholder.
 */
export function SmartySkeletonLoading(props: ViewProps): JSX.Element {
  const {className, style, testID = 'smarty-skeleton-loading', ...rest} = props;
  const [dimmed, setDimmed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setDimmed((prev) => !prev), 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      {...rest}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className={cn(
        'smarty-rounded-l bg-background-tertiary transition-opacity duration-700 ease-in-out',
        dimmed ? 'opacity-40' : 'opacity-100',
        className,
      )}
      style={style}
    />
  );
}
