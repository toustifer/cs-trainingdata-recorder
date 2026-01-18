import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class MatchesInfoFileNotFound extends BaseError {
    constructor() {
        super(ErrorCode.BoilerMatchesFileNotFound);
        this.message = 'matches.info file not found';
    }
}
//# sourceMappingURL=matches-info-file-not-found.js.map