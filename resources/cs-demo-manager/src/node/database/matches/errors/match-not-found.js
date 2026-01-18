import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class MatchNotFound extends BaseError {
    constructor() {
        super(ErrorCode.MatchNotFound);
        this.message = 'Match not found';
    }
}
//# sourceMappingURL=match-not-found.js.map