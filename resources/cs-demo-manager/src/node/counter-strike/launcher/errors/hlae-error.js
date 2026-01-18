import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class HlaeError extends BaseError {
    constructor() {
        super(ErrorCode.HlaeError);
        this.message = 'HLAE error';
    }
}
//# sourceMappingURL=hlae-error.js.map