import {createNativeBottomTabNavigator} from '@bottom-tabs/react-navigation';
import {fontFamily, semantic} from '@smarty-app/design-tokens';
import {en} from '@smarty-app/language';
import {useColorScheme} from 'nativewind';
import {JSX} from 'react';

import {ProfileScreen} from '../ProfileScreen';

const Tab = createNativeBottomTabNavigator();

const TAB_NAMES = {
  ACCOUNT: 'account',
} as const;

/**
 * Renders the bottom tab navigator for the home screen, allowing users to switch between different sections of the app.
 * The navigator includes the Account tab.
 *
 * @returns The JSX element representing the bottom tab navigator.
 */
export function HomeTabsNavigator(): JSX.Element {
  const colorsLight = useColorScheme().colorScheme === 'light';

  return (
    <Tab.Navigator
      labeled={true}
      tabBarActiveTintColor={
        colorsLight
          ? semantic.foreground.accent.light
          : semantic.foreground.accent.dark
      }
      tabBarInactiveTintColor={
        colorsLight
          ? semantic.foreground.secondary.light
          : semantic.foreground.secondary.dark
      }
      tabBarStyle={{
        backgroundColor: colorsLight
          ? semantic.background.primary.light
          : semantic.background.primary.dark,
      }}
      tabLabelStyle={{
        fontFamily: fontFamily.theme[0],
        fontWeight: '100',
        fontSize: 14,
      }}>
      <Tab.Screen
        name={TAB_NAMES.ACCOUNT}
        component={ProfileScreen}
        options={{
          tabBarLabel: en.accountTab,
        }}
      />
    </Tab.Navigator>
  );
}
