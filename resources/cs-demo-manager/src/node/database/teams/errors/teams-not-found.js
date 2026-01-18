import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class TeamsNotFound extends BaseError {
    constructor() {
        super(ErrorCode.TeamsNotFound);
        this.message = 'Teams not found';
    }
}
//# sourceMappingURL=teams-not-found.js.map