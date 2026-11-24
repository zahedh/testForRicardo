import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkColors, lightColors} from '@smarty-app/design-tokens';
import {useColorScheme, vars} from 'nativewind';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provides theme context for the app using NativeWind vars().
 * Defaults to dark mode on first launch.
 *
 * @param props - Component props.
 * @returns A React element wrapping children in a themed View.
 */
export function ThemeProvider(props: ThemeProviderProps) {
  const {children} = props;
  const {colorScheme, setColorScheme} = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run once on mount to set default theme if needed
    const initTheme = async () => {
      const stored = await AsyncStorage.getItem(
        '@react-native-async-storage/color-scheme',
      );
      if (stored === null) {
        // First launch - no preference stored, default to dark
        setColorScheme('dark');
      }
      setIsReady(true);
    };
    initTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Show dark mode while checking storage, then respect user's choice
  const active = !isReady || colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={vars(active)} className="flex-1">
      {children}
    </View>
  );
}
