import { BaseError } from 'csdm/node/errors/base-error';
export class CommandError extends BaseError {
    output;
    constructor(code, message, output) {
        super(code);
        this.message = message;
        this.output = output;
    }
}
//# sourceMappingURL=command-error.js.map