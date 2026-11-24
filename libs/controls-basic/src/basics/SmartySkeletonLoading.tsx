import {JSX, useEffect, useMemo, useState} from 'react';
import {Animated, Easing, ViewProps} from 'react-native';

import {cn} from '../classNameUtil';

/**
 * A skeleton loading placeholder with a looping "shade" pulse animation.
 *
 * @param props - Standard {@link ViewProps}.
 * @param props.className - Additional Tailwind classes to merge with the defaults.
 * @param props.testID - Test identifier. Defaults to `smarty-skeleton-loading`.
 * @returns A React element rendering the animated skeleton placeholder.
 */
export function SmartySkeletonLoading(props: ViewProps): JSX.Element {
  const {className, style, testID = 'smarty-skeleton-loading', ...rest} = props;
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const animatedStyle = useMemo(() => [{opacity}, style], [opacity, style]);

  return (
    <Animated.View
      {...rest}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className={cn('smarty-rounded-l bg-background-tertiary', className)}
      style={animatedStyle}
    />
  );
}
