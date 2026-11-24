import {Subscriber} from '@smarty-app/dx-api';
import {zustandWrapper} from '@smarty-app/util-generic';
import React from 'react';
import {create} from 'zustand';

const Context = React.createContext<unknown>(null);

export interface SubscriberModel {
  subscriber?: Subscriber;
}

export interface SubscriberStore extends SubscriberModel {
  setSubscriber: (subscriber: Subscriber) => void;
}

/** Holds the most recently loaded subscriber, in memory. */
export const useSubscriberStore = zustandWrapper(Context, () =>
  create<SubscriberStore>((set) => ({
    subscriber: undefined,
    setSubscriber: (subscriber: Subscriber) => {
      set({subscriber});
    },
  })),
);
