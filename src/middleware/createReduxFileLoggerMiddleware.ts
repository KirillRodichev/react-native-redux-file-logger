import type { Action, AnyAction } from 'redux';
import type { FileConfig, LoggerOptions } from '../types';
import type { ThunkMiddleware } from 'redux-thunk';
import { addLogger, createLoggerMiddleware, getLogger } from 'react-native-redux-file-logger';

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
    await addLogger(tag, fileConfig);
    const reduxFileLogger = getLogger(tag);
    const options: LoggerOptions = {...loggerOptions, logger: reduxFileLogger!};
    return createLoggerMiddleware(options);
  } catch (e) {
    console.error('createReduxFileLoggerMiddleware: ', e);
    throw e;
  }
}
