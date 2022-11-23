import type { Dispatch, Middleware, MiddlewareAPI } from 'redux';

export function createMiddlewareInjector<S = any, D extends Dispatch = Dispatch>(store: MiddlewareAPI<D, S>) {
    return function inject(middleware: Middleware) {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        store.dispatch = middleware(store)(store.dispatch);
    };
}
