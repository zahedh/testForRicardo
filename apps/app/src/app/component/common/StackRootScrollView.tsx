import {useTopBarInset} from '@smarty-app/components';
import {LoadingView} from '@smarty-app/controls';
import {cn, SmartyScrollView} from '@smarty-app/controls-basic';
import {BOTTOM_PADDING_PX} from '@smarty-app/core';
import {core} from '@smarty-app/design-tokens';
import {withAlpha} from '@smarty-app/util-generic';
import {Image, ImageSource} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import React, {JSX, useMemo, useState} from 'react';
import {
  ColorValue,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface StackRootScrollViewProps extends ScrollViewProps {
  /** True if we want to add the safe area top padding.  This would usually be when the containing screen's header is off. */
  addSafeTop?: boolean;
  /** True if we want to show the loading view overlay. */
  shouldShowLoadingView?: boolean;
  loadingViewTestID?: string;
  /** React Node to be rendered at the bottom of the scroll view. */
  bottomChildren?: React.ReactNode;
  /** True if we want the scroll view to scroll behind the bottom children. */
  shouldScrollBehindBottomChildren?: boolean;
  /** Image shown fixed at the top of the screen, behind the scrolling content (and the top bar). */
  headerImageSource?: ImageSource | number;
}

/**
 * Backdrop for a stack root screen.
 *
 * Scrolling past either end of the content exposes what sits behind the
 * scrolling view, so the backdrop carries the top app bar's tint over the top
 * half and the content color over the bottom half.
 *
 * @returns a JSX.Element
 */
export function StackRootBackdrop(): JSX.Element {
  return (
    <View pointerEvents="none" className={'absolute inset-0'}>
      <View className={'flex-1 bg-background-tertiary'} />
      <View className={'flex-1 bg-background-primary'} />
    </View>
  );
}

/**
 * Stack screen's root scroll view to be added at the top level of each stack screen which has scrolling content.
 *
 * @param props - React Native View Props
 * @returns a JSX.Element
 */
export function StackRootScrollView(
  props: StackRootScrollViewProps,
): React.JSX.Element {
  const {
    addSafeTop = false,
    shouldShowLoadingView,
    loadingViewTestID,
    bottomChildren,
    shouldScrollBehindBottomChildren = false,
    headerImageSource,
    className,
    contentContainerClassName,
    contentContainerStyle,
    children,
    ...rest
  } = props;

  const {top, bottom} = useSafeAreaInsets();
  const topBarInset = useTopBarInset();
  const [bottomChildViewHeight, setBottomChildViewHeight] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(0);

  const gradientHeight = Math.ceil(heightPercentageToDP('10%'));
  const gradientPadding = Math.max(24, heightPercentageToDP('2.75%'));

  /**
   * Handles scroll events and updates scroll position and content dimensions.
   *
   * @param event The native scroll event containing offset, size, and layout information.
   */
  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    setScrollPosition(contentOffset.y);
    setContentHeight(contentSize.height);
    setScrollViewHeight(layoutMeasurement.height);
  };

  /**
   * Handles scroll view layout and initializes scroll dimensions.
   *
   * @param event The layout event containing the scroll view dimensions.
   */
  const handleScrollViewLayout = (event: LayoutChangeEvent): void => {
    const {height} = event.nativeEvent.layout;
    setScrollViewHeight(height);
    setScrollPosition(0);
  };

  const bottomChildView = useMemo(() => {
    if (!bottomChildren) {
      return null;
    }

    /**
     * Calculates the gradient opacity based on the distance from the bottom of the scroll view.
     *
     * @returns The opacity value between 0 and 1.
     */
    const calculateGradientOpacity = (): number => {
      const distanceThreshold = bottomChildViewHeight + gradientPadding;
      const distanceFromBottom =
        contentHeight - scrollViewHeight - scrollPosition;

      if (distanceFromBottom >= distanceThreshold) {
        return 1;
      }
      if (distanceFromBottom <= 0) {
        return 0;
      }

      return distanceFromBottom / distanceThreshold;
    };

    const gradientOpacity = calculateGradientOpacity();

    const gradientColor = core.brand.slate[800];

    /**
     * Applies an alpha to the gradient color, scaled by how close the scroll
     * view is to the bottom.
     *
     * @param alpha - Opacity between 0 and 1 at full gradient opacity.
     * @returns The gradient color as `#rrggbbaa`.
     */
    const withScrolledAlpha = (alpha: number): string =>
      withAlpha(gradientColor, alpha * gradientOpacity);

    // Typed as a tuple because LinearGradient requires two or more stops.
    const gradientColors: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
      // Fully transparent first gradient stop; opacity is applied to later stops.
      '#00000000',
      withScrolledAlpha(0xaa / 0xff),
      withScrolledAlpha(0xdd / 0xff),
      withScrolledAlpha(0xee / 0xff),
    ];

    return (
      <View
        onLayout={(event) => {
          const {height} = event.nativeEvent.layout;
          setBottomChildViewHeight(height);
        }}
        // Padding is either a non-zero "safe area" bottom or our default padding.
        style={{paddingBottom: bottom || BOTTOM_PADDING_PX}}
        className={
          shouldScrollBehindBottomChildren
            ? 'absolute left-0 right-0 bottom-0'
            : 'mt-2'
        }>
        {shouldScrollBehindBottomChildren && (
          <View
            testID={'bottom-gradient-overlay'}
            pointerEvents="none"
            style={{height: bottomChildViewHeight + gradientHeight}}
            className={'absolute bottom-0 left-0 right-0'}>
            <LinearGradient
              colors={gradientColors}
              locations={[0, 0.2, 0.3, 0.4]}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
              }}
            />
          </View>
        )}
        <View className={'mx-5'}>{bottomChildren}</View>
      </View>
    );
  }, [
    bottomChildren,
    bottom,
    shouldScrollBehindBottomChildren,
    bottomChildViewHeight,
    gradientHeight,
    gradientPadding,
    contentHeight,
    scrollViewHeight,
    scrollPosition,
  ]);

  return (
    <View
      className={cn(`flex-1 bg-background-tertiary`)}
      style={{
        paddingTop: addSafeTop ? top : 0,
      }}>
      <StackRootBackdrop />
      {headerImageSource && (
        <Image
          accessible={false}
          pointerEvents="none"
          source={headerImageSource}
          contentFit="cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            aspectRatio: 1,
          }}
        />
      )}
      <SmartyScrollView
        className={cn(`flex-1`, className)}
        onLayout={handleScrollViewLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          ...StyleSheet.flatten(contentContainerStyle),
        }}
        {...rest} // rest are ScrollViewProps so they go with the scroll view.
      >
        <View
          className={headerImageSource ? undefined : 'bg-background-tertiary'}
          style={{
            height: topBarInset,
          }}
        />
        <View
          className={'flex-1 bg-background-primary smarty-rounded-t-2xl'}
          onLayout={(event) => {
            const {height} = event.nativeEvent.layout;
            setContentHeight(height);
          }}>
          <View
            className={contentContainerClassName}
            style={{
              paddingBottom: bottomChildView
                ? BOTTOM_PADDING_PX // Add padding so we don't touch bottomChildView area.
                : bottom || BOTTOM_PADDING_PX, // Padding is either a non-zero "safe area" bottom or our default padding.
            }}>
            {children}
            {shouldScrollBehindBottomChildren && (
              <View style={{height: bottomChildViewHeight + gradientPadding}} />
            )}
          </View>
        </View>
      </SmartyScrollView>

      {bottomChildView}

      <LoadingView
        testID={loadingViewTestID ?? 'loading-view'}
        visible={shouldShowLoadingView || false}
      />
    </View>
  );
}
