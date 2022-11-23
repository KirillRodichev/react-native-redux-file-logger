import type { Action, AnyAction } from 'redux';
import type { ThunkMiddleware } from 'redux-thunk';
// eslint-disable-next-line import/no-unresolved
import { addFileLogger, createLoggerMiddleware, getFileLogger } from 'react-native-redux-file-logger';
import type { FileConfig, LoggerOptions } from '../types';

export async function createReduxFileLoggerMiddleware<State = any, BasicAction extends Action = AnyAction>(
    tag: string,
    fileConfig: FileConfig,
    loggerOptions: Omit<LoggerOptions<State>, 'logger'>,
): Promise<ThunkMiddleware<State, BasicAction, LoggerOptions<State>>> {
    try {
        await addFileLogger(tag, fileConfig);
        const reduxFileLogger = getFileLogger(tag);
        const options: LoggerOptions = {
            ...loggerOptions,
            logger: reduxFileLogger!,
        };
        return createLoggerMiddleware(options);
    } catch (e) {
        console.error('createReduxFileLoggerMiddleware: ', e);
        throw e;
    }
}
