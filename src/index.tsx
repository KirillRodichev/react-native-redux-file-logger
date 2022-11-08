import { addFileLogger, getFileLogger } from './logger';
import { SupportedIosRootDirsEnum, SupportedAndroidRootDirsEnum, FileConfig } from './types';
import ReduxFileLoggerModule from './logger/ReduxFileLoggerModule';
import { useAsyncStoreCreator } from './hooks/useAsyncStoreCreator';
import { createLoggerMiddleware } from './middleware/createLoggerMiddleware';
import { createReduxFileLoggerMiddleware } from './middleware/createReduxFileLoggerMiddleware';

export type {LoggerOptions, FileConfig, InclusionPredicate} from './types'

async function archive(fileConfig: FileConfig, tag?: string): Promise<string> {
  return ReduxFileLoggerModule.archive(fileConfig, tag)
}

export {
  archive,
  addFileLogger,
  getFileLogger,
  useAsyncStoreCreator,
  createLoggerMiddleware,
  createReduxFileLoggerMiddleware,
  SupportedIosRootDirsEnum,
  SupportedAndroidRootDirsEnum,
};
