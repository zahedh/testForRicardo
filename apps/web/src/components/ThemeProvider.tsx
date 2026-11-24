'use client';

import {useColorScheme} from 'nativewind';
import {useEffect} from 'react';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider that applies the color scheme class to the document element.
 * Defaults to dark mode on first launch.
 *
 * A blocking script in layout.tsx sets the initial theme before React hydration.
 * This component syncs subsequent theme changes with the DOM.
 *
 * @param props - Component props.
 *
 * @returns A React element.
 */
export function ThemeProvider(props: ThemeProviderProps) {
  const {children} = props;
  const {colorScheme} = useColorScheme();

  // Sync colorScheme changes with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorScheme]);

  return <>{children}</>;
}
