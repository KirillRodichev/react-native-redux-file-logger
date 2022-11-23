import type { AnyAction } from 'redux';
import { diff } from 'deep-object-diff';
import { ReduxLogEntityBuilder, Requirements } from '../logger/ReduxLogEntityBuilder';

let logEntryBuilder: ReduxLogEntityBuilder;
const actionObj: AnyAction = { type: 'testType' };
const requirements: Requirements = {
    showDiff: true,
    shouldLogNextState: true,
    shouldLogPrevState: true,
};

beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2022, 11, 1));
});

afterAll(() => {
    jest.useRealTimers();
});

beforeEach(() => {
    logEntryBuilder = new ReduxLogEntityBuilder(actionObj, requirements);
    logEntryBuilder.addStartTime(new Date()).addEndTime(new Date());
});

describe('ReduxLogEntityBuilder', () => {
    const prevState = { counter: 1 };
    const nextState = { counter: 2 };

    describe('with all requirements', () => {
        it('should build with prev state', () => {
            logEntryBuilder.addPrevState(prevState);

            expect(logEntryBuilder.build()).toMatchSnapshot();
        });

        it('should build with next state', () => {
            logEntryBuilder.addNextState(nextState);

            expect(logEntryBuilder.build()).toMatchSnapshot();
        });

        it('should build with diff', () => {
            logEntryBuilder.addDiff(diff(prevState as object, nextState as object));

            expect(logEntryBuilder.build()).toMatchSnapshot();
        });

        it('should build all requirements', () => {
            logEntryBuilder.addPrevState(prevState);
            logEntryBuilder.addNextState(nextState);
            logEntryBuilder.addDiff(diff(prevState as object, nextState as object));

            expect(logEntryBuilder.build()).toMatchSnapshot();
        });
    });

    describe('without requirements', () => {
        it('should build empty action', () => {
            const emptyRequirements = {};
            const emptyActionBuilder = new ReduxLogEntityBuilder(actionObj, emptyRequirements);

            emptyActionBuilder.addStartTime(new Date()).addPrevState(prevState);
            emptyActionBuilder.addEndTime(new Date()).addNextState(nextState);
            emptyActionBuilder.addDiff(diff(prevState as object, nextState as object));

            expect(emptyActionBuilder.build()).toMatchSnapshot();
        });
    });
});
