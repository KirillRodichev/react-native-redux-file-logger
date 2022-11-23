import type { AnyAction } from 'redux';
import type { LoggerOptions } from 'react-native-redux-file-logger';
// eslint-disable-next-line import/no-unresolved
import { createLoggerMiddleware } from 'react-native-redux-file-logger';

describe('createLoggerMiddleware', () => {
    const store = {
        getState: jest.fn(),
        dispatch: jest.fn(),
    };
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    const options: LoggerOptions = { logger: console };

    const nextHandler = createLoggerMiddleware(options)(store);

    it('must return a function to handle next', () => {
        expect(nextHandler).toBeInstanceOf(Function);
        expect(nextHandler.length).toBe(1);
    });

    describe('handle next', () => {
        it('must return a function to handle action', () => {
            // @ts-ignore
            const actionHandler = nextHandler();

            expect(actionHandler).toBeInstanceOf(Function);
            expect(actionHandler.length).toBe(1);
        });

        describe('handle action', () => {
            it('must pass action to next if not a function', (done) => {
                const actionObj: AnyAction = { type: 'testType' };

                // @ts-ignore
                const actionHandler = nextHandler((action) => {
                    expect(action).toBe(actionObj);
                    done();
                });

                actionHandler(actionObj);
            });

            it('must return the return value of next if not a function', () => {
                const actionObj: AnyAction = { type: 'testType' };
                const expected = 'redux';
                // @ts-ignore
                const actionHandler = nextHandler(() => expected);

                const result = actionHandler(actionObj);
                expect(result).toBe(expected);
            });

            it('must invoke log on logger', () => {
                const actionObj: AnyAction = { type: 'testType' };
                const expected = 'redux';
                // @ts-ignore
                const actionHandler = nextHandler(() => expected);
                actionHandler(actionObj);

                expect(consoleLogMock).toHaveBeenCalled();
            });
        });
    });
});
