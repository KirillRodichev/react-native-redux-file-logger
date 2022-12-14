# File Logger for Redux

This tool allows you to log Redux actions + state to files. It also provides a convenient API for file logging, so that you can add your own loggers (e.g. navigation state).

**Use case:** QA team can easily create independent logs for each issue, which makes it much easier to understand the root-cause.

<img src='docs/img/logs-example.PNG' width='800'>

## Motivation

3rd party libraries like [react-native-fs](https://github.com/itinance/react-native-fs) allows you to write data to files, but each write operation opens & closes a new output stream.

The idea of this library is to use the standard output functions and redirect the output stream to a file, so that the stream remains open. In this case the logging process doesn't affect the app performance

- [Installation](#Installation)
- [Usage](#Usage)
  - [Creating Redux file logger middleware](#creating-redux-file-logger-middleware)
  - [Creating file logger](#creating-file-logger)
  - [Creating archive](#creating-archive)
- [API](#API)
  - [Types](#Types)
    - [LoggerOptions](#LoggerOptions)
    - [InclusionPredicate](#InclusionPredicate)
    - [FileConfig](#FileConfig)
  - [Constants](#Constants)
    - [SupportedIosRootDirsEnum](#SupportedIosRootDirsEnum)
    - [SupportedAndroidRootDirsEnum](#SupportedAndroidRootDirsEnum)
  - [Functions](#Functions)
    - [createReduxFileLoggerMiddleware](#createReduxFileLoggerMiddleware)
    - [createLoggerMiddleware](#createLoggerMiddleware)
    - [addFileLogger](#addFileLogger)
    - [getFileLogger](#getFileLogger)
    - [archive](#archive)
  - [Utils](#Utils)
    - [createMiddlewareInjector](#createMiddlewareInjector)
  - [Recipes](#Recipes)
    - [Pulling files from Android emulators](#pulling-files-from-android-emulators)
    - [Browsing files on iOS emulators](#browsing-files-on-ios-emulators)
- [Thanks](#Thanks)
- [License](#License)

## Installation

```sh
npm install react-native-redux-file-logger
npx pod-install
```

## Usage

### Creating Redux file logger middleware

1. Create a configurator for `createReduxFileLoggerMiddleware()` that returns middleware, so that later it can be injected to the `store`

```ts
import type { Action, AnyAction } from 'redux';
import type { ThunkMiddleware } from 'redux-thunk';
import type { LoggerOptions } from 'react-native-redux-file-logger';
import { Platform } from 'react-native';

export async function configureReduxFileLoggerMiddleware<
    State = any,
    BasicAction extends Action = AnyAction,
>(): Promise<ThunkMiddleware<State, BasicAction, LoggerOptions<State>> | null> {
    if (process.env.NODE_ENV === `development`) {
        const {
            createReduxFileLoggerMiddleware,
            SupportedIosRootDirsEnum,
            SupportedAndroidRootDirsEnum,
        } = require('react-native-redux-file-logger');

        try {
            const rootDir =
                Platform.OS === 'android' ? SupportedAndroidRootDirsEnum.Files : SupportedIosRootDirsEnum.Cache;
            return await createReduxFileLoggerMiddleware(
                'redux-action',
                {
                    rootDir,
                    nestedDir: 'logs',
                    fileName: 'time-travel.json',
                },
                {
                    showDiff: true,
                    shouldLogPrevState: false,
                    shouldLogNextState: true,
                },
            );
        } catch (e) {
            console.error(e);
        }
    }
    return null;
}
```

2. Create the store and a middleware injector. We can't just pass the middleware to `configureStore()`, because it's created asynchronously.

```ts
import { configureStore } from '@reduxjs/toolkit';
import { createMiddlewareInjector } from 'react-native-redux-file-logger';
import counterReducer from './features/counter/slice';

export const store = configureStore({
    reducer: { counter: counterReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const middlewareInjector = createMiddlewareInjector<RootState, AppDispatch>(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

3. Create Redux file logger middleware and inject it to the `store`.

```tsx
import * as React from 'react';
import { Provider } from 'react-redux';
import { store, middlewareInjector } from './store';
import { configureReduxFileLoggerMiddleware } from 'react-native-redux-file-logger';

export default function App() {
    useEffect(() => {
        (async () => {
            const rflMiddleware = await configureReduxFileLoggerMiddleware();
            if (rflMiddleware) {
                middlewareInjector(rflMiddleware);
            }
        })();
    }, []);

  return (
    <Provider store={store}>
      ...
    </Provider>
  );
}

```

### Creating file logger

Let's consider an example of a file logger for navigation state changes

1. Create file logger for navigation
```ts
import { Platform } from 'react-native';
import { addFileLogger, getFileLogger, SupportedAndroidRootDirsEnum, SupportedIosRootDirsEnum } from 'react-native-redux-file-logger';

const rootDir = Platform.OS === 'android' ? SupportedAndroidRootDirsEnum.Files : SupportedIosRootDirsEnum.Cache
await addFileLogger('navigation-state', {
  rootDir,
  nestedDir: 'logs',
  fileName: 'navigation.json'
});

export const navigationStateLogger = getFileLogger(tag);
```
2. Configure navigation state listener
```ts
import {createNavigationContainerRef} from '@react-navigation/native';
import {EventArg, EventListenerCallback, EventMapCore} from '@react-navigation/core';

export const navigationRef = createNavigationContainerRef();
export type StateListenerCallbackType = EventListenerCallback<EventMapCore<any>, 'state'>;
export function addNavigationStateListener(listener: StateListenerCallbackType): void {
  navigationRef.addListener('state', listener);
}
```
3. Pass `ref` to `NavigationContainer`
```tsx
import {navigationRef} from 'path/to/file'

return (
  <NavigationContainer ref={navigationRef} >
    ...
  </NavigationContainer>
)
```
4. Use logger inside navigation state listener
```ts
import {addStateListener, StateListenerCallbackType} from 'path/to/file'
import {navigationStateLogger} from 'path/to/file'

const stateListener: StateListenerCallbackType = e => {
  if (this.isInitialized && e.data.state && e.type) {
    navigationStateLogger.log(e.data.state);
  }
};

addNavigationStateListener(stateListener);
```

## Creating archive

Archiving logs from all file logger instances to a specified file. If you need to archive logs for a single instance, pass the `tag` as a second parameter (see API section).

```ts
import { Platform } from 'react-native';
import { archive, SupportedAndroidRootDirsEnum, SupportedIosRootDirsEnum } from 'react-native-redux-file-logger';

const zipFilePath = await archive({
  rootDir:
    Platform.OS === 'android'
      ? SupportedAndroidRootDirsEnum.Files
      : SupportedIosRootDirsEnum.Cache,
  fileName: 'logs.zip',
});
```

## API

### Types

#### LoggerOptions

```ts
type LoggerOptions<TState = any, TLogger extends {log: (message: string) => void} = Logger> = {
  actionInclusionPredicate?: InclusionPredicate<TState>;
  diffInclusionPredicate?: InclusionPredicate<TState>;

  shouldLogPrevState?: boolean;
  shouldLogNextState?: boolean;
  showDiff?: boolean;

  stateTransformer?: (state: any) => any;

  logger: TLogger;
};
```

- **actionInclusionPredicate** - actions filtering function, called before middleware logic execution. If returns false, the middleware won't be applied
- **actionInclusionPredicate** - diffs filtering function
- **shouldLogPrevState** - whether to add previous state to the file
- **shouldLogNextState** - whether to add next state to the file
- **showDiff** - whether to add diff(prev to next) state to the file
- **stateTransformer** - accepts prev & next state and applies its logic to is
- **logger** - logger instance, that implements `log(message: string) => void` method

#### InclusionPredicate

```ts
type InclusionPredicate<TState> = (action: AnyAction, getState: () => TState) => boolean;
```

#### FileConfig

```ts
type FileConfig = {
  fileName: string;
  nestedDir?: string;
  rootDir: SupportedIosRootDirsEnum | SupportedAndroidRootDirsEnum | string;
}
```
Example:
- rootDir: `/storage/emulated/0/Android/data/com.reduxfileloggerexample/files/` (i.e. SupportedAndroidRootDirsEnum.Files)
- nestedDir: `logs`
- fileName: `time-travel.json`
- Resulting path: `/storage/emulated/0/Android/data/com.reduxfileloggerexample/files/logs/time-travel.json`


### Constants

#### SupportedIosRootDirsEnum

Dirs that correspond to `FileManager.SearchPathDirectory` in `Foundation`

```ts
enum SupportedIosRootDirsEnum {
  Downloads = 'Downloads',
  Documents = 'Documents',
  AppSupportFiles = 'AppSupportFiles',
  Cache = 'Cache',
}
```
#### SupportedAndroidRootDirsEnum

Dirs taken from `ReactApplicationContext`

```ts
enum SupportedAndroidRootDirsEnum {
  Cache = 'Cache',
  Files = 'Files',
}
```

### Functions

#### createReduxFileLoggerMiddleware

```ts
async function createReduxFileLoggerMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(
  tag: string,
  fileConfig: FileConfig,
  loggerOptions: Omit<LoggerOptions<State>, 'logger'>
): Promise<ThunkMiddleware<State, BasicAction, ExtraThunkArg>> {}
```
Creates a Redux file logger middleware. Notice, that it doesn't accept `logger`, because it's encapsulated

- **tag** - unique logger identifier
- **fileConfig** - determines the file path (see above)
- **loggerOptions** - logger options (see above)

#### createLoggerMiddleware

```ts
function createLoggerMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(options: LoggerOptions<State>): ThunkMiddleware<State, BasicAction, ExtraThunkArg> {}
```
Creates a logger middleware. Unlike `createReduxFileLoggerMiddleware()`, it accepts a `logger` instance, so you can provide your own implementation.

- **options** - logger options (see above)

#### addFileLogger

```ts
const addFileLogger = async (tag: string, fileConfig: FileConfig) => Promise<void>
```

Creates a unique file logger instance and stores in a map. Use it when you need to add file logger in addition to Redux (e.g. navigation state change, see example above).

- **tag** - unique logger identifier
- **fileConfig** - determines the file path (see above)

#### getFileLogger

```ts
interface Logger {
  log: (message: string) => void;
}

const getFileLogger = (tag: string) => Logger | undefined
```
Gets a logger instance from map by `tag`.

- **tag** - unique logger identifier

#### archive

```ts
async function archive(fileConfig: FileConfig, tag?: string): Promise<string> {}
```

Archive logs from all logger instances (or for a specific instance if `tag` is provided) to a file. Supports only `zip` format for Android. After a successful archive creation the logs are emptied.

- **tag** - unique logger identifier
- **fileConfig** - determines the file path (see above)

### Utils

#### createMiddlewareInjector

```ts
function createMiddlewareInjector<S = any, D extends Dispatch = Dispatch>(store: MiddlewareAPI<D, S>) {
    return function inject(middleware: Middleware) {
        store.dispatch = middleware(store)(store.dispatch);
    };
}
```
Create an injector that can be used to add middlewares.

### Recipes

#### Pulling files from Android emulators

```shell
adb root
adb pull /storage/emulated/0/Android/data/com.reduxfileloggerexample/files/example/time-travel.json /Users/{$user}/Desktop
```

#### Browsing files on iOS emulators

1. Copy `archive` result to the clipboard
2. Finder --> Go --> Go to folder
3. Paste the value & hit enter

## License

MIT

## Thanks

Inspired by [Oleg Titaev](https://github.com/yadormad
)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
