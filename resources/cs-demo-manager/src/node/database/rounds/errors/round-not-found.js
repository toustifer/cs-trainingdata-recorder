import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class RoundNotFound extends BaseError {
    constructor() {
        super(ErrorCode.RoundNotFound);
        this.message = 'Round not found';
    }
}
//# sourceMappingURL=round-not-found.js.map