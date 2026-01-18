import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class ChecksumsMismatch extends BaseError {
    constructor() {
        super(ErrorCode.ChecksumsMismatch);
        this.message = 'Checksums mismatch';
    }
}
//# sourceMappingURL=checksums-mismatch.js.map