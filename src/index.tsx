import { addFileLogger, getFileLogger } from './logger';
import { SupportedIosRootDirsEnum, SupportedAndroidRootDirsEnum, FileConfig } from './types';
import ReduxFileLoggerModule from './logger/ReduxFileLoggerModule';
import { createLoggerMiddleware } from './middleware/createLoggerMiddleware';
import { createReduxFileLoggerMiddleware } from './middleware/createReduxFileLoggerMiddleware';
import { createMiddlewareInjector } from './utils/injectMiddleware';

export type { LoggerOptions, FileConfig, InclusionPredicate } from './types';

async function archive(fileConfig: FileConfig, tag?: string): Promise<string> {
    return ReduxFileLoggerModule.archive(fileConfig, tag);
}

export {
    archive,
    addFileLogger,
    getFileLogger,
    createLoggerMiddleware,
    createMiddlewareInjector,
    createReduxFileLoggerMiddleware,
    SupportedIosRootDirsEnum,
    SupportedAndroidRootDirsEnum,
};
