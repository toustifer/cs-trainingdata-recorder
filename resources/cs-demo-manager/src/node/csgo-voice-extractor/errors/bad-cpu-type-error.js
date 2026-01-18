import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class BadCpuTypeError extends BaseError {
    constructor() {
        super(ErrorCode.BadCpuType);
        this.message = 'Bad CPU type';
    }
}
//# sourceMappingURL=bad-cpu-type-error.js.map