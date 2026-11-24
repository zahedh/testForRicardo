import {useTopBarInset} from '@smarty-app/components';
import {LoadingView} from '@smarty-app/controls';
import {cn} from '@smarty-app/controls-basic';
import {BOTTOM_PADDING_PX} from '@smarty-app/core';
import {JSX} from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface StackRootViewProps extends ViewProps {
  /** True if we want to add the safe area top padding.  This would usually be when the containing screen's header is off. */
  addSafeTop?: boolean;
  /** True if we want to add the safe area bottom padding. This would be false if the screen contains a list and does not have a fixed bottom. */
  addSafeBottom?: boolean;
  shouldShowLoadingView?: boolean;
  loadingViewTestID?: string;
}

/**
 * Stack root view to be added at the top level of each stack screen.
 *
 * @param props - React Native View Props
 * @returns a JSX.Element
 */
export function StackRootView(props: StackRootViewProps): JSX.Element {
  const {top, bottom} = useSafeAreaInsets();
  const topBarInset = useTopBarInset();
  const {
    addSafeTop = false,
    addSafeBottom = true,
    shouldShowLoadingView,
    loadingViewTestID,
    className,
    style,
    children,
    ...rest
  } = props;

  return (
    <View {...rest} className={cn(`flex-1 bg-background-primary`, className)}>
      <View
        className={'absolute h-full w-full'}
        style={[
          style,
          {
            // We need to add padding as style, as adding a dynamic value to className (e.g. `pt-[${top}px]`) won't work.
            // The top app bar inset already covers the safe area, so the two are never both needed.
            paddingTop: topBarInset + (addSafeTop ? top : 0),
            paddingBottom: addSafeBottom ? bottom || BOTTOM_PADDING_PX : 0,
          },
        ]}>
        <View pointerEvents="none" className={'absolute inset-0'}>
          <View className={'flex-1 bg-background-tertiary'} />
          <View className={'flex-1 bg-background-primary'} />
        </View>
        {children}
      </View>
      <LoadingView
        testID={loadingViewTestID ?? 'loading-view'}
        visible={shouldShowLoadingView || false}
      />
    </View>
  );
}
