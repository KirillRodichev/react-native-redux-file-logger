import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Button, Platform } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { archive, SupportedIosRootDirsEnum, SupportedAndroidRootDirsEnum } from 'react-native-redux-file-logger';
import Counter from './features/counter/Counter';
import { middlewareInjector, store } from './store';
import { configureReduxFileLoggerMiddleware } from './middleware';

export default function App() {
    useEffect(() => {
        (async () => {
            const rflMiddleware = await configureReduxFileLoggerMiddleware();
            if (rflMiddleware) {
                middlewareInjector(rflMiddleware);
            }
        })();
    }, []);

    const handleArchive = useCallback(async () => {
        try {
            const rootDir =
                Platform.OS === 'android' ? SupportedAndroidRootDirsEnum.Files : SupportedIosRootDirsEnum.Cache;
            const path = await archive({
                rootDir,
                fileName: 'logs.zip',
            });
            // eslint-disable-next-line no-console
            console.log('path', path);
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <Provider store={store}>
            <Counter />
            <Button title="ARCHIVE" onPress={handleArchive} />
        </Provider>
    );
}
