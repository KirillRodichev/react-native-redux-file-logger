import ReduxFileLoggerModule from './ReduxFileLoggerModule';
import type { FileConfig, Logger } from '../types';

export class FileLoggers {
  private readonly fileLoggers = new Map<string, Logger>();

  public addLogger = async (tag: string, fileConfig: FileConfig) => {
    await ReduxFileLoggerModule.addLogger(tag, fileConfig);
    this.fileLoggers.set(tag, {
      log: message => ReduxFileLoggerModule.log(tag, message),
    })
  }

  public getLogger = (tag: string) => {
    return this.fileLoggers.get(tag);
  }
}
