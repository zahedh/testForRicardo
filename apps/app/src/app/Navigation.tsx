import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {ApiErrorAlertPanel} from '@smarty-app/components';
import {SmartyDialogProvider} from '@smarty-app/controls';
import {darkColors, lightColors} from '@smarty-app/design-tokens';
import {useColorScheme} from 'nativewind';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HomeStackNavigator} from './navigation/HomeStackNavigator';

/**
 * Navigation component with dynamic theme support based on color scheme.
 *
 * @returns The navigation component.
 */
export function Navigation() {
  const {colorScheme} = useColorScheme();
  const colors = colorScheme === 'light' ? lightColors : darkColors;
  const {top} = useSafeAreaInsets();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        dark: !(colorScheme === 'light'), // Forcing undefined to default to dark.
        colors: {
          primary: colors['--color-foreground-accent'],
          background: colors['--color-background-primary'],
          card: colors['--color-background-primary'],
          text: colors['--color-foreground-primary'],
          border: colors['--color-stroke-medium'],
          notification: colors['--color-foreground-warning'],
        },
      }}>
      <SmartyDialogProvider>
        <GestureHandlerRootView>
          <HomeStackNavigator />
        </GestureHandlerRootView>
      </SmartyDialogProvider>
      <ApiErrorAlertPanel
        className={'absolute w-full smarty-px-l smarty-mt-s'}
        top={top}
        shadow
      />
    </NavigationContainer>
  );
}
