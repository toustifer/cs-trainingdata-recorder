import { ErrorCode } from 'csdm/common/error-code';
import { BaseError } from 'csdm/node/errors/base-error';
export class AccessDeniedError extends BaseError {
    constructor() {
        super(ErrorCode.AccessDenied);
        this.message = 'Access denied';
    }
}
//# sourceMappingURL=access-denied-error.js.map