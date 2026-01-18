import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class NoSequencesFound extends BaseError {
    constructor() {
        super(ErrorCode.NoSequencesFound);
        this.message = 'No sequences found';
    }
}
//# sourceMappingURL=no-sequences-found.js.map