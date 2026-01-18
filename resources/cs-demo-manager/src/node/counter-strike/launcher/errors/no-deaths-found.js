import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NoDeathsFound extends BaseError {
    constructor() {
        super(ErrorCode.NoDeathsFound);
        this.message = 'No deaths found';
    }
}
//# sourceMappingURL=no-deaths-found.js.map