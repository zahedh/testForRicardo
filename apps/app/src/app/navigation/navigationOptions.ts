import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {SmartyTopBarOptions} from '@smarty-app/controls';
import {semantic} from '@smarty-app/design-tokens';
import {getSmartyRadius} from '@smarty-app/util-generic';
import {Platform} from 'react-native';

const baseStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: false,
  headerTitle: '',
  headerTitleAlign: 'center',
  headerShadowVisible: false,
  headerBackButtonMenuEnabled: false, // Disables the long-press menu on the back button for a cleaner UX.
  headerBackButtonDisplayMode: 'minimal', // Removes back button label on iOS.
};

const noBackButtonScreenStackOptions: NativeStackNavigationOptions = {
  gestureEnabled: false,
};

/**
 * Options for a screen presented as a sheet: a card that slides up over the
 * screen below, with rounded top corners and the content behind dimmed.
 *
 * The two platforms reach that look differently. iOS gets it from a native
 * `formSheet`. Android's own formSheet sizes itself from its content, which a
 * nested navigator measures as zero, collapsing the sheet to a sliver - so
 * there the screen is a plain translucent modal sliding up from the bottom, and
 * SmartyRootSheetScreenView.android draws the dim and the inset card itself.
 *
 * Screens presented this way have no header, so they need to draw their own
 * close control (see SheetBackOrCloseButton).
 */
export const sheetScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  title: '',
  ...Platform.select<NativeStackNavigationOptions>({
    ios: {
      presentation: 'formSheet',
      contentStyle: {height: '100%'},
      sheetCornerRadius: getSmartyRadius('.smarty-rounded-2xl'),
    },
    default: {
      presentation: 'transparentModal',
      animation: 'slide_from_bottom',
      contentStyle: {backgroundColor: 'transparent'},
    },
  }),
};

/**
 * Options for the stack navigator that hosts a sheet stack (breakout journey stack).
 */
export const sheetStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'card',
  animation: 'slide_from_right',
  contentStyle: {backgroundColor: 'transparent'},
};

/**
 * Returns the screen options for the stack navigator based on the current color scheme.
 *
 * @param colorScheme The current color scheme ('light' or 'dark').
 * @returns The navigation options for the stack navigator.
 */
export function getStackScreenOptions(
  colorScheme: 'light' | 'dark',
): NativeStackNavigationOptions {
  const colorsLight = colorScheme === 'light';
  return {
    ...baseStackScreenOptions,
    headerTintColor: colorsLight
      ? semantic.foreground.primary.light
      : semantic.foreground.primary.dark,
  };
}

/**
 * @param options The navigation options for screens with no back navigation.
 * @returns The navigation options for screens with no back navigation.
 */
export function getSuccessScreenStackOptions(
  options?: SmartyTopBarOptions,
): NativeStackNavigationOptions {
  return {
    ...noBackButtonScreenStackOptions,
    ...options,
    headerShown: false,
  };
}
