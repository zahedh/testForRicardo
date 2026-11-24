import {Platform} from 'react-native';
import {useBottomTabBarHeight} from 'react-native-bottom-tabs';

/**
 * Gets bottom spacing for tab screen scroll content.
 *
 * @returns The bottom spacing needed for the current platform.
 */
export function useTabScreenBottomSpacing(): number {
  const tabBarHeight = useBottomTabBarHeight();

  return Platform.OS === 'ios' ? tabBarHeight : 0;
}
