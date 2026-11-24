import {getQueryClient} from '@smarty-app/api-controller';
import {QueryClientProvider} from '@tanstack/react-query';
import {JSX} from 'react';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {ThemeProvider} from '../theme/ThemeProvider';
import {Navigation} from './Navigation';

/**
 * Main application component
 *
 * @returns A React component.
 */
export function App(): JSX.Element {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <KeyboardProvider>
            <Navigation />
          </KeyboardProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
