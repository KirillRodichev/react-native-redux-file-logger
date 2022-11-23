import { FileLoggers } from './FileLoggers';

export const { addLogger: addFileLogger, getLogger: getFileLogger } = new FileLoggers();
