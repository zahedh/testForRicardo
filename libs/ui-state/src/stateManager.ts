'use client';

import {zustandWrapper} from '@smarty-app/util-generic';
import React from 'react';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import {create} from 'zustand';

const Context = React.createContext<unknown>(null);

export interface StateManagerStore {
  stateStoreResets: Set<() => void>;
  addStateStoreReset: (resetFn: () => void) => void;
  resetStateStores: () => void;
}

export type StateStore = {
  reset: () => void;
};

export const useStateManagerStore = zustandWrapper(Context, () =>
  create<StateManagerStore>((_set, get) => {
    const store: StateManagerStore = {
      stateStoreResets: new Set<() => void>(),
      addStateStoreReset: (resetFn: () => void) => {
        get().stateStoreResets.add(resetFn);
      },
      resetStateStores: () => {
        get().stateStoreResets.forEach((reset) => reset());
      },
    };
    return store;
  }),
);

/**
 * @param resetFn the reset function from the store that needs to be reset on unmount
 * @param shouldResetOnUnmount a boolean to ensure that the reset callback is always called when the
 * component (which invoked this hook) is unmounted/destroyed. Set to true by default, if you need to reset
 * the state based on another scenario, you will have to pass it as false.
 * @param shouldResetOnWeb a boolean to ensure that the reset callback is also called when running on the web platform. Set to false by default.
 */
export function useResetOnUnmount(
  resetFn: () => void,
  shouldResetOnUnmount = true,
  shouldResetOnWeb = false,
) {
  useEffect(() => {
    return () => {
      if (shouldResetOnUnmount && (Platform.OS !== 'web' || shouldResetOnWeb)) {
        resetFn();
      }
    };
  }, [resetFn, shouldResetOnUnmount, shouldResetOnWeb]);
}
