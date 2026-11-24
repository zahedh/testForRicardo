import {JSX} from 'react';

import {apiErrorStateStore} from './smarty-alert/apiErrorStateStore';
import {useStateManagerStore} from './stateManager';

/**
 * StateStoreProviders is a component that provides the state stores for the application.
 *
 * This is accessed by the web entry point.
 *
 * @param children - Top level React components that will be wrapped by the StateStoreProviders to gain access to the state stores.
 * @param children.children - The child components that will have access to the state stores.
 * @returns The StateStoreProviders component.
 */
export function StateStoreProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <useStateManagerStore.Provider>
      <apiErrorStateStore.Provider>{children}</apiErrorStateStore.Provider>
    </useStateManagerStore.Provider>
  );
}
