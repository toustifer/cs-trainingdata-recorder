import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NetworkError extends BaseError {
    constructor() {
        super(ErrorCode.NetworkError);
        this.message = 'Network error';
    }
}
//# sourceMappingURL=network-error.js.map