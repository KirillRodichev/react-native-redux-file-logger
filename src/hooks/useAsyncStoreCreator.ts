import type { Action, AnyAction, Store } from 'redux';
import { useEffect, useState } from 'react';

type AsyncStoreCreator<
  TState = any,
  TAction extends Action = AnyAction,
  TStore extends Store<TState, TAction> = Store<TState, TAction>
> = () => Promise<TStore>

export const useAsyncStoreCreator = <
  TState = any,
  TAction extends Action = AnyAction,
  TStore extends Store<TState, TAction> = Store<TState, TAction>
>(asyncStoreCreator: AsyncStoreCreator<TState, TAction, TStore>): TStore | undefined => {
  const [store, setStore] = useState<TStore>();

  useEffect(() => {
    try {
      (async () => {
        setStore(await asyncStoreCreator());
      })();
    } catch (e) {
      console.error(e)
    }
  }, []);

  return store;
}
