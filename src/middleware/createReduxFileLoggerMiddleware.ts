import type { Action, AnyAction } from 'redux';
import type { FileConfig, LoggerOptions } from '../types';
import type { ThunkMiddleware } from 'redux-thunk';
import { addFileLogger, createLoggerMiddleware, getFileLogger } from 'react-native-redux-file-logger';

export async function createReduxFileLoggerMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(
  tag: string,
  fileConfig: FileConfig,
  loggerOptions: Omit<LoggerOptions<State>, 'logger'>
): Promise<ThunkMiddleware<State, BasicAction, ExtraThunkArg>> {
  try {
    await addFileLogger(tag, fileConfig);
    const reduxFileLogger = getFileLogger(tag);
    const options: LoggerOptions = {...loggerOptions, logger: reduxFileLogger!};
    return createLoggerMiddleware(options);
  } catch (e) {
    console.error('createReduxFileLoggerMiddleware: ', e);
    throw e;
  }
}
