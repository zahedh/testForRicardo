'use client';

import {useContext} from 'react';
import {Platform} from 'react-native';
import {StoreApi, UseBoundStore} from 'zustand';

type ZustandWrapper<T> = {
  (): T;
  store: UseBoundStore<StoreApi<T>>;
  getState: () => T;
  Provider: React.ComponentType<{children: React.ReactNode}>;
};

/**
 * @param Context - A React context to hold the Zustand store. Must be a global
 * variable.
 * @param fn - A function that creates a Zustand store.
 *
 * @returns A custom hook that provides access to the store, along with a
 * Provider component and getState function.
 */
export function zustandWrapper<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context: React.Context<any>,
  fn: () => UseBoundStore<StoreApi<T>>,
): ZustandWrapper<T> {
  if (Platform.OS === 'web') {
    // For next.js, we need to keep the store in a React context to avoid
    // issue with module splitting and multiple instances of the store
    const useStore = (() => {
      const context = useContext(Context);
      if (!context) {
        throw new Error('useStore() called on store with no Provider');
      }

      return context();
    }) as ZustandWrapper<T>;

    useStore.Provider = ({
      children,
    }: {
      children: React.ReactNode;
    }): React.ReactElement => {
      if (!useStore.store) {
        useStore.store = fn();
      }

      return (
        <Context.Provider value={useStore.store}>{children}</Context.Provider>
      );
    };

    useStore.getState = (): T => {
      const state = useStore.store?.getState();
      if (!state) {
        throw new Error('getState() called on store with no Provider');
      }

      return state;
    };

    return useStore;
  }

  // For native apps, we can just use zustand pretty much as is
  const store = fn();

  // If this ever goes wrong
  const useStore = store as unknown as ZustandWrapper<T>;
  useStore.store = store;

  // A no-op Provider in case it's accidentally used
  useStore.Provider = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactNode => {
    return children;
  };

  if (!useStore.getState) {
    useStore.getState = (): T => {
      return store.getState();
    };
  }

  return useStore;
}
