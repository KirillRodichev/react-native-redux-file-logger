import type { Action, AnyAction } from 'redux';
import type { ThunkMiddleware } from 'redux-thunk';
import type { LoggerOptions } from 'react-native-redux-file-logger';
import { Platform } from 'react-native';

export async function configureReduxFileLoggerMiddleware<
    State = any,
    BasicAction extends Action = AnyAction,
>(): Promise<ThunkMiddleware<State, BasicAction, LoggerOptions<State>> | null> {
    if (process.env.NODE_ENV === `development`) {
        const {
            createReduxFileLoggerMiddleware,
            SupportedIosRootDirsEnum,
            SupportedAndroidRootDirsEnum,
            // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
        } = require('react-native-redux-file-logger');

        try {
            const rootDir =
                Platform.OS === 'android' ? SupportedAndroidRootDirsEnum.Files : SupportedIosRootDirsEnum.Cache;
            return await createReduxFileLoggerMiddleware(
                'redux-action',
                {
                    rootDir,
                    nestedDir: 'logs',
                    fileName: 'time-travel.json',
                },
                {
                    showDiff: true,
                    shouldLogPrevState: false,
                    shouldLogNextState: true,
                },
            );
        } catch (e) {
            console.error(e);
        }
    }
    return null;
}
