import * as React from 'react';
import { useCallback } from 'react';

import { Provider } from 'react-redux';
import Counter from './features/counter/Counter';
import createStore from './store';
import { Button, Platform } from 'react-native';
import {
  archive,
  SupportedIosRootDirsEnum,
  useAsyncStoreCreator,
} from 'react-native-redux-file-logger';
import { SupportedAndroidRootDirsEnum } from '../../src/types';

export default function App() {
  const store = useAsyncStoreCreator(createStore);

  const handleArchive = useCallback(async () => {
    try {
      const path = await archive({
        rootDir:
          Platform.OS === 'android'
            ? SupportedAndroidRootDirsEnum.Files
            : SupportedIosRootDirsEnum.Cache,
        fileName: 'logs.zip',
      });
      console.log('path', path);
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!store) {
    return null;
  }

  return (
    <Provider store={store}>
      <Counter />
      {/* @ts-ignore */}
      <Button title="ARCHIVE" onPress={handleArchive} />
    </Provider>
  );
}
