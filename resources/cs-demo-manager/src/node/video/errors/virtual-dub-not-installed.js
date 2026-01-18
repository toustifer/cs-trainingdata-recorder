import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class VirtualDubNotInstalled extends BaseError {
    constructor() {
        super(ErrorCode.VirtualDubNotInstalled);
        this.message = 'VirtualDub is not installed';
    }
}
//# sourceMappingURL=virtual-dub-not-installed.js.map