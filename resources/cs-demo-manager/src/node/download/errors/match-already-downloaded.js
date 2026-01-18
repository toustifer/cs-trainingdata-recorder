import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class MatchAlreadyDownloaded extends BaseError {
    constructor() {
        super(ErrorCode.MatchAlreadyDownloaded);
        this.message = 'Match already downloaded';
    }
}
//# sourceMappingURL=match-already-downloaded.js.map