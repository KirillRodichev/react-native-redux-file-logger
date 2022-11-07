import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/slice';
import { createReduxFileLoggerMiddleware, SupportedIosRootDirsEnum } from 'react-native-redux-file-logger';
import type { Middleware } from 'redux';

async function createStore() {
  const middlewares: Middleware[] = [];

  try {
    const mid = await createReduxFileLoggerMiddleware(
      'redux-action',
      {
        rootDir: SupportedIosRootDirsEnum.Cache,
        // nestedDir: 'nested',
        fileName: 'time-travel.json'
      },
      {
        showDiff: true,
        shouldLogPrevState: true,
        shouldLogNextState: true,
        stateTransformer: (state) => state,
      }
    )

    middlewares.push(mid);
  } catch (e) {
    console.error('App: unable to init rflm');
    console.error(e);
  }

  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(middlewares),
  });
}
export default createStore;
