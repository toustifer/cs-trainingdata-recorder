import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NoRoundsFound extends BaseError {
    constructor() {
        super(ErrorCode.NoRoundsFound);
        this.message = 'No rounds found';
    }
}
//# sourceMappingURL=not-rounds-found.js.map