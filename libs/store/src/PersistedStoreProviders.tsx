import {JSX} from 'react';

import {useSubscriberStore} from './persisted/subscriberStore';

/**
 * PersistedStoreProviders - A component that provides all of the persisted stores to its children.
 * This is accessed by the web entry point.
 *
 * @param children - Top level React components that will be wrapped by the PersistedStoreProviders to gain access to the persisted stores.
 * @param children.children - The child components that will have access to the persisted stores.
 * @returns The PersistedStoreProviders component.
 */
export function PersistedStoreProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <useSubscriberStore.Provider>{children}</useSubscriberStore.Provider>;
}
