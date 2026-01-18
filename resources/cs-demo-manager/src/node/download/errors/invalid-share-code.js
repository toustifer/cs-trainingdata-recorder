import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidShareCode extends BaseError {
    constructor(shareCode) {
        super(ErrorCode.InvalidShareCode);
        this.message = `Invalid share code ${shareCode}`;
    }
}
//# sourceMappingURL=invalid-share-code.js.map