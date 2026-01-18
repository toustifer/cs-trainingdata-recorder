import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class InvalidArgs extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorInvalidArgs);
        this.message = 'Invalid arguments';
    }
}
//# sourceMappingURL=invalid-args.js.map