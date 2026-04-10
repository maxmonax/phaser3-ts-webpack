import { LogMng } from "../LogMng";

type StateItem = {
    name: string;
    onStart?: (...args: unknown[]) => void;
    onUpdate?: (...args: unknown[]) => void;
    onEnd?: (...args: unknown[]) => void;
    context?: unknown;
};

export class StackFSM {
    private stateList: { [id: string]: StateItem };
    private stack: StateItem[];

    constructor() {
        this.stateList = {};
        this.stack = [];
    }

    initState(aName: string, aContext?: unknown, aUpdate?: (...args: unknown[]) => void, aStart?: (...args: unknown[]) => void, aEnd?: (...args: unknown[]) => void) {
        if (this.stateList[aName]) {
            LogMng.warn('StackFSM: Trying to add an already existing state ' + aName);
            return;
        }
        this.stateList[aName] = {
            name: aName,
            onStart: aStart,
            onUpdate: aUpdate,
            onEnd: aEnd,
            context: aContext
        };
    }

    pushState(aName: string) {
        const stateData = this.stateList[aName];
        if (!stateData) {
            LogMng.warn('StackFSM: Trying to push a uninitialized state ' + aName);
            return;
        }

        const currState = this.getCurrentState();
        if (!currState || currState.name !== aName) {
            this.stack.push(stateData);
            if (stateData.onStart) stateData.onStart.call(stateData.context);
        }
    }

    popState() {
        const st = this.stack.pop();
        if (st?.onEnd) st.onEnd.call(st.context);
    }

    getCurrentState(): StateItem | undefined {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }

    free() {
        this.stack = [];
        this.stateList = {};
    }

    update(dt: number): void {
        const currStateItem = this.getCurrentState();
        if (currStateItem && currStateItem.onUpdate) {
            currStateItem.onUpdate.call(currStateItem.context, dt);
        }
    }

}
