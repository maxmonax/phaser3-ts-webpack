import { LogMng } from "../LogMng";

interface IState {
    name: string;
    context?: unknown;
    userData?: unknown;
    onEnter?: (...args: unknown[]) => void;
    onUpdate?: (...args: unknown[]) => void;
    onExit?: (...args: unknown[]) => void;
};

type stateQueueItem = {
    name: string;
    userData: unknown;
};

export class FSM {

    private stateList = new Map<string, IState>();
    private changeStateQueue: stateQueueItem[] = [];
    private isChangingState = false;
    private currState?: IState;

    addState(aName: string, aContext?: unknown, aEnter?: (...args: unknown[]) => void, aUpdate?: (...args: unknown[]) => void, aExit?: (...args: unknown[]) => void): FSM | undefined {

        if (this.stateList.has(aName)) {
            LogMng.warn('FSM -> Trying to add an already existing state ' + aName);
            return undefined;
        }

        this.stateList.set(aName, {
            name: aName,
            context: aContext,
            onEnter: aEnter,
            onUpdate: aUpdate,
            onExit: aExit
        });

        return this;

    }

    startState(aName: string, aUserData: unknown = null) {

        if (!this.stateList.has(aName)) {
            LogMng.warn(`FSM -> Tried to start an uninitialized state ${aName}`);
            return;
        }

        if (this.isCurrentState(aName)) {
            return;
        }

        if (this.isChangingState) {
            this.changeStateQueue.push({
                name: aName,
                userData: aUserData
            });
            return;
        }

        this.isChangingState = true;

        const oldState = this.currState;

        if (oldState && oldState.onExit) {
            oldState.onExit.call(oldState.context);
        }

        this.currState = this.stateList.get(aName);
        if (this.currState) {
            this.currState.userData = aUserData;
            if (this.currState.onEnter) this.currState.onEnter.call(this.currState.context, aUserData);
        }

        this.isChangingState = false;
    }

    isCurrentState(aName: string): boolean {
        return !!this.currState && this.currState.name === aName;
    }

    getCurrentState(): IState | undefined {
        return this.currState;
    }

    free() {
        this.currState = undefined;
        this.stateList.clear();
    }

    update(dt: number): void {

        if (this.changeStateQueue.length > 0) {
            const data = this.changeStateQueue.shift()!;
            this.startState(data.name, data.userData);
            return;
        }

        if (this.currState && this.currState.onUpdate) {
            this.currState.onUpdate.call(this.currState.context, dt, this.currState.userData);
        }
    }

}
