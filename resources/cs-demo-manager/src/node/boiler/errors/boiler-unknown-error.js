import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class BoilerUnknownError extends BaseError {
    constructor() {
        super(ErrorCode.BoilerUnknownError);
        this.message = 'An unknown error occurred while running boiler';
    }
}
//# sourceMappingURL=boiler-unknown-error.js.map