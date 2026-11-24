'use client';

import {SmartyDialogProvider} from '@smarty-app/controls';
import {useEffect, useState} from 'react';

import {RootLayoutClientInit} from '@/app/RootLayoutClientInit';
import {StoreProviders} from '@/components/StoreProviders';
import {ThemeProvider} from '@/components/ThemeProvider';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

/**
 * Client-side code for component for RootLayout.
 *
 * @param param0 - Component props.
 * @param param0.children - Content to be rendered within the layout.
 * @returns A React element.
 */
export function RootLayoutClient({children}: RootLayoutClientProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Let layout + fonts + hydration settle
    const frameId = requestAnimationFrame(() => {
      setReady(true);
    });

    // Clean-up on unmount.
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <ThemeProvider>
      <StoreProviders>
        <SmartyDialogProvider>
          <RootLayoutClientInit />
          {ready ? children : null}
        </SmartyDialogProvider>
      </StoreProviders>
    </ThemeProvider>
  );
}
