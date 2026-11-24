import React, {JSX, useEffect, useMemo, useState} from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  ScrollViewProps,
  View,
  ViewProps,
} from 'react-native';

import {useColorNameClassToStyle} from '../classNameUtil';

export const SmartyScrollView = React.forwardRef(
  (
    props: ScrollViewProps,
    ref: React.ForwardedRef<ScrollView>,
  ): JSX.Element => {
    const testID = props.testID || 'smarty-scroll-view';
    return (
      <ScrollView
        {...props}
        testID={testID}
        data-testid={testID}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        ref={ref}
      />
    );
  },
);

//When you use React.forwardRef to create a component, React loses the component's name in debugging tools like React DevTools. Instead of seeing "SmartyScrollView" in the component tree, you'd see "Anonymous" or "ForwardRef".
SmartyScrollView.displayName = 'SmartyScrollView';

/**
 * Basic "background" view that uses colorNameClassToStyle to automatically detect hex colors (e.g. bg-[#ff0000]) in className and apply them as styles.
 */
export const SmartyBackground = React.forwardRef(
  (props: ViewProps, ref: React.ForwardedRef<View>): JSX.Element => {
    const {className, style, children, ...restProps} = props;
    const colorNameClassToStyle = useColorNameClassToStyle();
    const styleData = colorNameClassToStyle({
      className: className || '',
      style,
    });
    return (
      <View
        ref={ref}
        className={styleData.className}
        style={styleData.style}
        {...restProps}>
        {children}
      </View>
    );
  },
);

//When you use React.forwardRef to create a component, React loses the component's name in debugging tools like React DevTools. Instead of seeing "SmartyBackground" in the component tree, you'd see "Anonymous" or "ForwardRef".
SmartyBackground.displayName = 'SmartyBackground';

export type AnimatedViewStyle = React.ComponentProps<
  typeof Animated.View
>['style'];

type AnimatedSpacerProps = {
  testID?: string;
  height: number;
  duration?: number;
};
/**
 * A vertical spacer which animates its height.
 *
 * @param props - Component props.
 * @param props.height - Desired height.
 * @param props.duration - Time in milliseconds for the animation to run.
 * @param props.testID - Test ID for the spacer.
 * @returns A React element.
 */
export function AnimatedSpacer(props: AnimatedSpacerProps): JSX.Element {
  const {testID, height, duration = 250} = props;
  const [animatedValue] = useState(() => new Animated.Value(height));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: height,
      duration,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.linear),
    }).start();
  }, [animatedValue, duration, height]);

  const animatedStyle = useMemo(
    (): AnimatedViewStyle => ({
      height: animatedValue,
    }),
    [animatedValue],
  );

  return <Animated.View testID={testID} style={animatedStyle} />;
}
