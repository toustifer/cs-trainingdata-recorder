import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DecodeShareCodeError extends BaseError {
    constructor(shareCode) {
        super(ErrorCode.DecodeShareCodeError);
        this.message = `Error decoding share code ${shareCode}`;
    }
}
//# sourceMappingURL=decode-sharecode-error.js.map