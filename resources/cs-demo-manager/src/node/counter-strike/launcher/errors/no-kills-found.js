import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NoKillsFound extends BaseError {
    constructor() {
        super(ErrorCode.NoKillsFound);
        this.message = 'No kills found';
    }
}
//# sourceMappingURL=no-kills-found.js.map