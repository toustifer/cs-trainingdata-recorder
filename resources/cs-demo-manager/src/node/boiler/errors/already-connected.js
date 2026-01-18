import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class AlreadyConnected extends BaseError {
    constructor() {
        super(ErrorCode.BoilerAlreadyConnected);
        this.message = 'Already connected to GC';
    }
}
//# sourceMappingURL=already-connected.js.map