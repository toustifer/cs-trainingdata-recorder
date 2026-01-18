import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class MissingLibraryFiles extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorMissingLibraryFiles);
        this.message = 'Missing library files';
    }
}
//# sourceMappingURL=missing-library-files.js.map