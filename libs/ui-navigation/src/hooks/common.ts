import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

/**
 * A custom hook that returns a callback function to handle back navigation for app.
 *
 * @returns A callback function that will be called when back navigation is needed.
 */
export function useOnBackNavigation(): () => void {
  const navigation = useNavigation();

  return useCallback(() => {
    navigation.goBack();
  }, [navigation]);
}
