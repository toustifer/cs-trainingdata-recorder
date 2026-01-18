import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidDemoPath extends BaseError {
    constructor() {
        super(ErrorCode.InvalidDemoPath);
        this.message = 'Invalid demo path';
    }
}
//# sourceMappingURL=invalid-demo-path.js.map