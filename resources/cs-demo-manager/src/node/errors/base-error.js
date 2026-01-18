export class BaseError extends Error {
    code;
    constructor(code, cause) {
        super();
        this.code = code;
        this.cause = cause;
    }
}
//# sourceMappingURL=base-error.js.map