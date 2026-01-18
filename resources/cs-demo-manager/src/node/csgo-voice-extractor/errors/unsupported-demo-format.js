import { BaseError } from 'csdm/node/errors/base-error';
import { ErrorCode } from 'csdm/common/error-code';
export class UnsupportedDemoFormat extends BaseError {
    constructor() {
        super(ErrorCode.CsVoiceExtractorUnsupportedDemoFormat);
        this.message = 'Unsupported demo format';
    }
}
//# sourceMappingURL=unsupported-demo-format.js.map