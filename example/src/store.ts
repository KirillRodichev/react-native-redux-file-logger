import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMiddlewareInjector } from 'react-native-redux-file-logger';
import counterReducer from './features/counter/slice';

export const store = configureStore({
    reducer: { counter: counterReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const middlewareInjector = createMiddlewareInjector<RootState, AppDispatch>(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
