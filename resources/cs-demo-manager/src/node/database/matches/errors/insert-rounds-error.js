import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InsertRoundsError extends BaseError {
    constructor(cause) {
        super(ErrorCode.InsertRoundsError, cause);
        this.message = 'Insert rounds error';
    }
}
//# sourceMappingURL=insert-rounds-error.js.map