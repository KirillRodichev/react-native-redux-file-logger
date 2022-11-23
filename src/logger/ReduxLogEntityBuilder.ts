import type { AnyAction } from 'redux';
import type { LoggerOptions } from 'react-native-redux-file-logger';
import { formatDate, getDuration } from './helpers';

export type Requirements = Pick<LoggerOptions, 'showDiff' | 'shouldLogPrevState' | 'shouldLogNextState'>;

export class ReduxLogEntityBuilder<TState = any> {
    private readonly action: AnyAction;
    private diff?: any;
    private prevState?: TState;
    private nextState?: TState;
    private startTime?: Date;
    private endTime?: Date;
    private requirements: Requirements;

    constructor(action: AnyAction, requirements: Requirements) {
        this.action = action;
        this.requirements = requirements;
    }

    public addPrevState(prevState: TState) {
        if (this.requirements.shouldLogPrevState) {
            this.prevState = prevState;
        }
        return this;
    }

    public addNextState(nextState: TState) {
        if (this.requirements.shouldLogNextState) {
            this.nextState = nextState;
        }
        return this;
    }

    public addDiff(diff: any) {
        if (this.requirements.showDiff) {
            this.diff = diff;
        }
        return this;
    }

    public addStartTime(date: Date) {
        this.startTime = date;
        return this;
    }

    public addEndTime(date: Date) {
        this.endTime = date;
        return this;
    }

    public build(): string {
        return this.stringify();
    }

    private stringify() {
        const formattedStartDate = formatDate(this.startTime);
        const duration = getDuration(this.startTime, this.endTime);
        const key = `action: ${this.action.type} @ ${formattedStartDate} (in ${duration})`;

        const logEntity = {
            action: this.action,
            prevState: this.prevState,
            diff: this.diff,
            nextState: this.nextState,
        };

        return `"${key}": ${JSON.stringify(logEntity)},`;
    }
}
