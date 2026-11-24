'use client';

import {zustandWrapper} from '@smarty-app/util-generic';
import React from 'react';
import {create} from 'zustand';
import {useShallow} from 'zustand/react/shallow';

import {
  StateStore,
  useResetOnUnmount,
  useStateManagerStore,
} from '../stateManager';

const Context = React.createContext<unknown>(null);

interface ApiErrorStateModel {
  errorText?: string;
}

const initialState: ApiErrorStateModel = {
  errorText: undefined,
};

interface ApiErrorStateCallbacks {
  setErrorText: (errorText: string) => void;
}

export type ApiErrorStateStore = StateStore &
  ApiErrorStateModel &
  ApiErrorStateCallbacks;

export const apiErrorStateStore = zustandWrapper(Context, () =>
  create<ApiErrorStateStore>((set) => {
    const reset = () => set(() => ({...initialState}));

    useStateManagerStore.getState().addStateStoreReset(reset);

    return {
      ...initialState,
      setErrorText: (errorText: string) =>
        set(() => ({
          errorText,
        })),
      reset,
    };
  }),
);

/**
 * `useApiErrorStateStore` is a custom React hook that gets the state of the main api error smarty alert component.
 *
 * The hook uses the `apiErrorStateStore` function to get the state store for the smarty alert component.
 * If the store's state is `undefined`, the hook initializes it with the `initialState`.
 *
 * @param selector - A selector function to select specific pieces of state from the api error state store.
 * @param shouldResetOnUnmount whether or not the calling component should reset the store when it unmounts.
 * @returns the store object with defined (non-null) {@link ApiErrorStateStore} state and callbacks
 */
export function useApiErrorStateStore<PartialState>(
  selector: (state: ApiErrorStateStore) => PartialState,
  shouldResetOnUnmount?: boolean,
): PartialState {
  useResetOnUnmount(apiErrorStateStore.getState().reset, shouldResetOnUnmount);
  const shallowSelector = useShallow(selector);

  return apiErrorStateStore.store(shallowSelector);
}
