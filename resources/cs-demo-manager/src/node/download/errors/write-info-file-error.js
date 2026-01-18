import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class WriteDemoInfoFileError extends BaseError {
    constructor() {
        super(ErrorCode.WriteDemoInfoFileError);
        this.message = 'Error while writing demo info file.';
    }
}
//# sourceMappingURL=write-info-file-error.js.map