import {cn} from '@smarty-app/controls-basic';
import {JSX} from 'react';
import {ActivityIndicator, View} from 'react-native';

type LoadingViewProps = {
  className?: string;
  testID?: string;
  visible: boolean;
  transparent?: boolean;
  rounded?: boolean;
  showActivityIndicator?: boolean;
};

/**
 * Renders a loading view with an optional activity indicator.
 *
 * @param {object} props - The props.
 * @param {string} props.testID - Test ID for the view.
 * @param {boolean} props.visible - Whether the view should be visible.
 * @param {boolean} props.transparent - Whether the background should be transparent.
 * @param {boolean} props.showActivityIndicator - Whether to show the activity indicator.
 * @returns The loading view.
 */
export function LoadingView(props: LoadingViewProps): JSX.Element | null {
  const {
    className,
    testID = 'loading-view',
    visible,
    transparent = false,
    rounded = false,
    showActivityIndicator = true,
  } = props;
  if (visible) {
    return (
      <View
        testID={testID}
        // Use absolute inset-0 instead of percentage sizing so it reliably covers the screen
        className={cn(
          'absolute inset-0 z-100 items-center justify-center',
          className,
        )}>
        <View
          testID="background-view"
          className={cn(
            'absolute inset-0',
            transparent ? 'bg-transparent' : 'bg-black opacity-30',
            rounded ? 'smarty-rounded-l' : undefined,
          )}
        />
        {showActivityIndicator && (
          <ActivityIndicator
            testID="activity-indicator"
            size="large"
            color="white"
          />
        )}
      </View>
    );
  } else {
    return null;
  }
}

type EmptyLoadingViewProps = {
  testID?: string;
  height?: number;
};

/**
 * Renders a bounded box with LoadingView centered inside it.
 * Could serve as a temporary "skeleton loader".
 * Note that this element is always visible, as is the {@link LoadingView} it contains.
 *
 * @param props - The props.
 * @returns A React element containing a box with a LoadingView.
 */
export function EmptyLoadingView(
  props: EmptyLoadingViewProps,
): JSX.Element | null {
  const {testID = 'empty-loading-view', height = 400} = props;
  return (
    <View className="w-full justify-center items-center" style={{height}}>
      <LoadingView testID={testID} rounded visible={true} />
    </View>
  );
}
