export class AbortError extends Error {
    constructor() {
        super();
        this.name = 'AbortError';
    }
}
export const abortError = new AbortError();
export function throwIfAborted(signal) {
    if (signal?.aborted) {
        throw abortError;
    }
}
//# sourceMappingURL=abort-error.js.map