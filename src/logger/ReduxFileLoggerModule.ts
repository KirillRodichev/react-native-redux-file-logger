import { NativeModules, Platform } from 'react-native';
import type { FileConfig } from '../types';

const LINKING_ERROR =
  `The package 'react-native-redux-file-logger' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ReduxFileLoggerModule = NativeModules.ReduxFileLogger
  ? NativeModules.ReduxFileLogger
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

type ReduxFileLoggerInterface = {
  addLogger: (tag: string, fileConfig: FileConfig) => Promise<void>;
  archive: (fileConfig: FileConfig, tag?: String) => Promise<string>;
  log: (tag: string, message: string) => void;
}

export default ReduxFileLoggerModule as ReduxFileLoggerInterface;
