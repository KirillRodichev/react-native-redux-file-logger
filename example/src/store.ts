import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/slice';
import type { Middleware } from 'redux';
import { Platform } from 'react-native';

async function createStore() {
  const middlewares: Middleware[] = [];

  if (process.env.NODE_ENV === `development`) {
    const {
      createReduxFileLoggerMiddleware,
      SupportedIosRootDirsEnum,
      SupportedAndroidRootDirsEnum,
    } = require('react-native-redux-file-logger');

    try {
      const rootDir = Platform.OS === 'android' ? SupportedAndroidRootDirsEnum.Files : SupportedIosRootDirsEnum.Cache
      const rflMiddleware = await createReduxFileLoggerMiddleware(
        'redux-action',
        {
          rootDir,
          nestedDir: 'logs',
          fileName: 'time-travel.json'
        },
        {
          showDiff: true,
          shouldLogPrevState: false,
          shouldLogNextState: true,
        }
      )

      middlewares.push(rflMiddleware);
    } catch (e) {
      console.error(e);
    }
  }

  return configureStore({
    reducer: { counter: counterReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
  });
}

export default createStore;
