import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {smartyTopBarOptions} from '@smarty-app/controls';
import {en} from '@smarty-app/language';
import {HomeStackParamList} from '@smarty-app/ui-navigation';
import {useColorScheme} from 'nativewind';
import {JSX} from 'react';

import {ChangeEmailScreen} from '../screen/you/account-settings/ChangeEmailScreen';
import {PaymentHistoryScreen} from '../screen/you/payment-history/PaymentHistoryScreen';
import {HomeTabsNavigator} from './HomeTabsNavigator';
import {getStackScreenOptions} from './navigationOptions';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

/**
 * HomeStackNavigator component that defines the home stack navigator for the app.
 * It includes the tabs and the screens pushed on top of them.
 *
 * @returns The HomeStackNavigator component.
 */
export function HomeStackNavigator(): JSX.Element {
  const {colorScheme} = useColorScheme();
  const navigationColorScheme = colorScheme ?? 'dark';
  const stackScreenOptions = getStackScreenOptions(navigationColorScheme);

  return (
    <HomeStack.Navigator
      initialRouteName="HomeTabs"
      id="home-stack"
      screenOptions={stackScreenOptions}>
      <HomeStack.Screen
        name="HomeTabs"
        component={HomeTabsNavigator}
        options={{headerShown: false, title: ''}}
      />
      <HomeStack.Screen
        name="ChangeEmail"
        component={ChangeEmailScreen}
        options={smartyTopBarOptions({title: en.changeEmailHeader})}
      />
      <HomeStack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={smartyTopBarOptions({title: en.paymentHistoryTitle})}
      />
    </HomeStack.Navigator>
  );
}
