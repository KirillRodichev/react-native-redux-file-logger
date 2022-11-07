import { addLogger, getLogger } from './logger';
import { FileConfig, SupportedIosRootDirsEnum } from './types';
import ReduxFileLoggerModule from './logger/ReduxFileLoggerModule';
import { useAsyncStoreCreator } from './hooks/useAsyncStoreCreator';
import { createLoggerMiddleware } from './middleware/createLoggerMiddleware';
import { createReduxFileLoggerMiddleware } from './middleware/createReduxFileLoggerMiddleware';

export type {LoggerOptions} from './types'

function archive(fileConfig: FileConfig, tag?: string) {
  return ReduxFileLoggerModule.archive(fileConfig, tag)
}

export {
  archive,
  addLogger,
  getLogger,
  useAsyncStoreCreator,
  createLoggerMiddleware,
  createReduxFileLoggerMiddleware,
  SupportedIosRootDirsEnum,
};
