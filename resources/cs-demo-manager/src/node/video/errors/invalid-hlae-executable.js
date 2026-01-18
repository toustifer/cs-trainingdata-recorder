import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidHlaeExecutable extends BaseError {
    constructor() {
        super(ErrorCode.InvalidHlaeExecutable);
        this.message = 'Invalid HLAE executable';
    }
}
//# sourceMappingURL=invalid-hlae-executable.js.map