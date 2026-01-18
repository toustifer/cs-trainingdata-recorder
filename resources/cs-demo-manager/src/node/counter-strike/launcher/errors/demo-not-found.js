import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class DemoNotFound extends BaseError {
    constructor() {
        super(ErrorCode.DemoNotFound);
        this.message = 'Demo not found';
    }
}
//# sourceMappingURL=demo-not-found.js.map