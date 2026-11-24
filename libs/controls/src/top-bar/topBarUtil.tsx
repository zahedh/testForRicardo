import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {BackButtonType} from '@smarty-app/core';
import {useEffect} from 'react';

import {SmartyTopBar, SmartyTopBarOptions} from './SmartyTopBar';

/**
 * Builds the navigator `options` required to render a {@link SmartyTopBar}
 * header, including an optional static title and subtitle.
 *
 * @param options - Static SmartyTopBar options (title, subtitle, etc.).
 * @returns Native stack navigation options with the {@link SmartyTopBar} header.
 */
export function smartyTopBarOptions(
  options: SmartyTopBarOptions = {},
): NativeStackNavigationOptions {
  return {
    ...options,
    // The bar is translucent, so it floats above the screen content rather than
    // taking space from it. Screen roots re-add the space with
    // `addTopAppBarInset`.
    headerTransparent: true,
    header: (props) => {
      const barOptions = props.options as SmartyTopBarOptions;
      const {navigation} = props;
      return (
        <SmartyTopBar
          {...barOptions}
          goBack={
            // Caller has to explicitly pass None to remove the back button.
            barOptions.backButtonType !== BackButtonType.None
              ? navigation.goBack
              : undefined
          }
        />
      );
    },
  };
}

/**
 * Sets {@link SmartyTopBar} options (title, subtitle, trailing buttons)
 * dynamically from within a screen.
 *
 * @param options - The {@link SmartyTopBar} options to apply to the active screen.
 */
export function useSmartyTopBarOptions(
  options: Partial<SmartyTopBarOptions>,
): void {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(options as Partial<NativeStackNavigationOptions>);
  }, [navigation, options]);
}
