
export interface ILogger {
    logDebug(aMsg: string, aData?: unknown): void;
    logWarn(aMsg: string, aData?: unknown): void;
    logError(aMsg: string, aData?: unknown): void;
}
