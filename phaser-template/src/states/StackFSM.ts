import { LogMng } from "../utils/LogMng";

type StateItem = {
    name: string;
    onStart: Function;
    onUpdate: Function;
    onEnd: Function;
    context: any;
};

export class StackFSM {
    private stateList: { [id: string]: StateItem };
    private stack: StateItem[];

    constructor() {
        this.stateList = {};
        this.stack = [];
    }

    initState(aName: string, aContext?: any, aUpdate?: Function, aStart?: Function, aEnd?: Function) {
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
        let stateData = this.stateList[aName];
        if (!stateData) {
            LogMng.warn('StackFSM: Trying to push a uninitialized state ' + aName);
            return;
        }
        
        let currState = this.getCurrentState();
        if (!currState || currState.name != aName) {
            this.stack.push(stateData);
            if (stateData.onStart) stateData.onStart.call(stateData.context);
        }
    }

    popState() {
        let st = this.stack.pop();
        if (st.onEnd) st.onEnd.call(st.context);
    }
    
    getCurrentState(): StateItem {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }

    free() {
        this.stack = [];
        this.stateList = {};
    }

    update(dt: number): void {
        let currStateItem = this.getCurrentState();

        if (currStateItem && currStateItem.onUpdate) {
            currStateItem.onUpdate.call(currStateItem.context, dt);
        }
    }

}