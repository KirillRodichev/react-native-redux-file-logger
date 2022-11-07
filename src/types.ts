import type { AnyAction } from 'redux';

export interface Logger {
  log: (message: string) => void;
}

type InclusionPredicate<TState> = (action: AnyAction, getState: () => TState) => boolean;

export type LoggerOptions<TState = any, TLogger extends {log: (message: string) => void} = Logger> = {
  actionInclusionPredicate?: InclusionPredicate<TState>;
  diffInclusionPredicate?: InclusionPredicate<TState>;

  shouldLogPrevState?: boolean;
  shouldLogNextState?: boolean;
  showDiff?: boolean;

  stateTransformer: (state: any) => any;

  logger: TLogger;
};

export enum SupportedIosRootDirsEnum {
  Downloads = 'Downloads',
  Documents = 'Documents',
  AppSupportFiles = 'AppSupportFiles',
  Cache = 'Cache',
}

export enum SupportedAndroidRootDirsEnum {
  Cache = 'Cache',
  Files = 'Files',
}

export type FileConfig = {
  fileName: string;
  nestedDir?: string;
  rootDir: SupportedIosRootDirsEnum | SupportedAndroidRootDirsEnum | string;
}
