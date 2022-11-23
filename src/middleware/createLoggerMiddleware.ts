import type { LoggerOptions } from 'react-native-redux-file-logger';
import type { Action, AnyAction } from 'redux';
import type { ThunkMiddleware } from 'redux-thunk';
import { diff } from 'deep-object-diff';
import { ReduxLogEntityBuilder } from '../logger/ReduxLogEntityBuilder';

interface MergedOptions extends Omit<LoggerOptions, 'stateTransformer'> {
    stateTransformer: (state: any) => any;
}

const defaultOptions: Required<Pick<LoggerOptions, 'showDiff' | 'stateTransformer'>> = {
    stateTransformer: (state) => state,
    showDiff: true,
};

export function createLoggerMiddleware<State = any, BasicAction extends Action = AnyAction>(
    options: LoggerOptions<State>,
): ThunkMiddleware<State, BasicAction, LoggerOptions<State>> {
    const mergedOptions: MergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const { logger, stateTransformer, actionInclusionPredicate, diffInclusionPredicate, ...requirements } =
        mergedOptions;

    return ({ getState }) =>
        (next) =>
        (action) => {
            if (actionInclusionPredicate && !actionInclusionPredicate(action, getState)) {
                return next(action);
            }

            const prevState = getState();
            const logEntryBuilder = new ReduxLogEntityBuilder<State>(action, requirements);
            logEntryBuilder.addStartTime(new Date()).addPrevState(stateTransformer(prevState));

            const result = next(action);
            const nextState = getState();
            logEntryBuilder.addEndTime(new Date()).addNextState(stateTransformer(nextState));

            if (!diffInclusionPredicate || diffInclusionPredicate(action, getState)) {
                logEntryBuilder.addDiff(diff(prevState as object, nextState as object));
            }

            logger.log(logEntryBuilder.build());

            return result;
        };
}
