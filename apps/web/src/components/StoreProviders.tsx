'use client';

import {getQueryClient} from '@smarty-app/api-controller';
import {PersistedStoreProviders} from '@smarty-app/store';
import {StateStoreProviders} from '@smarty-app/ui-state';
import {QueryClientProvider} from '@tanstack/react-query';

/**
 *
 * @param props - Component props.
 * @param props.children - Content to be rendered within the store providers.
 *
 * @returns A React element that wraps the children with the zustand store
 * providers.
 */
export function StoreProviders({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <StateStoreProviders>
        <PersistedStoreProviders>{children}</PersistedStoreProviders>
      </StateStoreProviders>
    </QueryClientProvider>
  );
}
