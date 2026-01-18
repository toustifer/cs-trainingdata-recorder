import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidDemoHeader extends BaseError {
    constructor(reason) {
        super(ErrorCode.InvalidDemoHeader);
        this.message = `Invalid demo header: ${reason}`;
    }
}
//# sourceMappingURL=invalid-demo-header.js.map